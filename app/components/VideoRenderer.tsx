'use client'
import { useState, useRef, useCallback } from 'react'

interface Scene {
  id: number
  text: string
  mediaUrl?: string
  mediaType: 'video' | 'image'
  durationSeconds: number
  type: 'hook' | 'story' | 'cta'
}

interface Props {
  scenes: Scene[]
  audioUrl: string | null
  musicUrl: string | null
  musicVolume: number
  captionColor: string
  topic: string
  onComplete: (url: string) => void
  onError: (err: string) => void
}

export default function VideoRenderer({
  scenes, audioUrl, musicUrl, musicVolume, captionColor, topic, onComplete, onError
}: Props) {
  const [status, setStatus] = useState<'idle'|'rendering'|'done'|'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const renderVideo = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) { onError('Canvas not available'); return }

    setStatus('rendering')
    setProgress(2)
    setStatusText('Initialising…')

    // 1080x1920 = 9:16 portrait
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')!

    try {
      // ── LOAD ALL MEDIA FIRST ──────────────────────────────────────
      setStatusText('Loading scene media…')
      const sceneMedia: (HTMLVideoElement | HTMLImageElement | null)[] = []

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i]
        setProgress(2 + Math.round((i / scenes.length) * 20))
        setStatusText(`Loading scene ${i + 1} of ${scenes.length}…`)

        if (!scene.mediaUrl) { sceneMedia.push(null); continue }

        try {
          if (scene.mediaType === 'image') {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            await new Promise<void>((res, rej) => {
              img.onload = () => res()
              img.onerror = () => res() // fallback to black on error
              img.src = `/api/proxy-media?url=${encodeURIComponent(scene.mediaUrl!)}`
              setTimeout(res, 8000) // 8s timeout
            })
            sceneMedia.push(img.complete && img.naturalWidth > 0 ? img : null)
          } else {
            const vid = document.createElement('video')
            vid.crossOrigin = 'anonymous'
            vid.muted = true
            vid.playsInline = true
            vid.loop = true
            vid.preload = 'auto'
            await new Promise<void>((res) => {
              vid.oncanplaythrough = () => res()
              vid.onerror = () => res()
              vid.src = `/api/proxy-media?url=${encodeURIComponent(scene.mediaUrl!)}`
              vid.load()
              setTimeout(res, 10000) // 10s timeout
            })
            sceneMedia.push(vid)
          }
        } catch {
          sceneMedia.push(null)
        }
      }

      // ── AUDIO SETUP ───────────────────────────────────────────────
      setProgress(25)
      setStatusText('Setting up audio…')

      const audioCtx = new AudioContext()
      const dest = audioCtx.createMediaStreamDestination()
      const totalDuration = scenes.reduce((s, sc) => s + (sc.durationSeconds || 5), 0)

      // Load voiceover
      if (audioUrl) {
        try {
          const res = await fetch(`/api/proxy-media?url=${encodeURIComponent(audioUrl)}`)
          const buf = await res.arrayBuffer()
          const decoded = await audioCtx.decodeAudioData(buf)
          const src = audioCtx.createBufferSource()
          src.buffer = decoded
          const gain = audioCtx.createGain()
          gain.gain.value = 1.0
          src.connect(gain)
          gain.connect(dest)
          src.start(0)
        } catch (e) {
          console.warn('Voiceover load failed:', e)
        }
      }

      // Load background music
      if (musicUrl) {
        try {
          const res = await fetch(`/api/proxy-media?url=${encodeURIComponent(musicUrl)}`)
          const buf = await res.arrayBuffer()
          const decoded = await audioCtx.decodeAudioData(buf)
          const src = audioCtx.createBufferSource()
          src.buffer = decoded
          src.loop = true
          const gain = audioCtx.createGain()
          gain.gain.value = musicVolume
          src.connect(gain)
          gain.connect(dest)
          src.start(0)
        } catch (e) {
          console.warn('Music load failed:', e)
        }
      }

      // ── MEDIA RECORDER SETUP ──────────────────────────────────────
      setProgress(30)
      setStatusText('Starting recorder…')

      const canvasStream = canvas.captureStream(30)
      const audioTracks = dest.stream.getAudioTracks()
      audioTracks.forEach(t => canvasStream.addTrack(t))

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm'

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 4000000,
      })

      const chunks: Blob[] = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

      // ── RENDER SCENES TO CANVAS ───────────────────────────────────
      const FPS = 30
      recorder.start(100)

      // Start all videos playing
      for (let i = 0; i < sceneMedia.length; i++) {
        const m = sceneMedia[i]
        if (m instanceof HTMLVideoElement) {
          m.currentTime = 0
          m.play().catch(() => {})
        }
      }

      let totalFrames = 0
      const allFrames = scenes.reduce((s, sc) => s + Math.round((sc.durationSeconds || 5) * FPS), 0)

      for (let si = 0; si < scenes.length; si++) {
        const scene = scenes[si]
        const media = sceneMedia[si]
        const duration = scene.durationSeconds || 5
        const frames = Math.round(duration * FPS)

        // Reset video to start for each scene
        if (media instanceof HTMLVideoElement) {
          media.currentTime = 0
          await new Promise<void>(r => setTimeout(r, 100))
        }

        for (let f = 0; f < frames; f++) {
          // Draw black background
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, 1080, 1920)

          // Draw media
          if (media instanceof HTMLImageElement && media.complete && media.naturalWidth > 0) {
            const scale = Math.max(1080 / media.naturalWidth, 1920 / media.naturalHeight)
            const w = media.naturalWidth * scale
            const h = media.naturalHeight * scale
            ctx.drawImage(media, (1080 - w) / 2, (1920 - h) / 2, w, h)
          } else if (media instanceof HTMLVideoElement && media.readyState >= 2) {
            const scale = Math.max(1080 / media.videoWidth, 1920 / media.videoHeight)
            const w = media.videoWidth * scale
            const h = media.videoHeight * scale
            ctx.drawImage(media, (1080 - w) / 2, (1920 - h) / 2, w, h)
          }

          // Draw caption
          if (scene.text) {
            const fontSize = 72
            ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.9)'
            ctx.shadowBlur = 20
            ctx.shadowOffsetX = 3
            ctx.shadowOffsetY = 3

            // Word wrap
            const words = scene.text.split(' ')
            const lines: string[] = []
            let line = ''
            const maxWidth = 900
            for (const word of words) {
              const test = line ? `${line} ${word}` : word
              if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line)
                line = word
              } else {
                line = test
              }
            }
            if (line) lines.push(line)

            const lineHeight = fontSize * 1.3
            const totalH = lines.length * lineHeight
            const startY = 1920 * 0.78 - totalH / 2

            // Background pill
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
            ctx.fillStyle = 'rgba(0,0,0,0.5)'
            const padX = 40, padY = 20
            ctx.beginPath()
            ctx.roundRect(
              1080/2 - maxWidth/2 - padX,
              startY - padY,
              maxWidth + padX*2,
              totalH + padY*2,
              20
            )
            ctx.fill()

            // Text
            ctx.shadowColor = 'rgba(0,0,0,0.8)'
            ctx.shadowBlur = 8
            ctx.fillStyle = captionColor || '#ffffff'
            lines.forEach((l, li) => {
              ctx.fillText(l, 1080 / 2, startY + li * lineHeight + fontSize / 2)
            })
            ctx.shadowBlur = 0
          }

          totalFrames++
          const pct = 30 + Math.round((totalFrames / allFrames) * 60)
          if (f % 15 === 0) {
            setProgress(Math.min(pct, 89))
            setStatusText(`Rendering scene ${si + 1}/${scenes.length}…`)
          }

          // Wait for next frame at 30fps
          await new Promise<void>(r => setTimeout(r, 1000 / FPS))
        }
      }

      // ── FINALISE ──────────────────────────────────────────────────
      setProgress(90)
      setStatusText('Finalising…')

      await new Promise<void>(resolve => {
        recorder.onstop = () => resolve()
        recorder.stop()
      })

      audioCtx.close()

      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setStatus('done')
      setStatusText('Done!')
      onComplete(url)

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Render failed'
      console.error('Render error:', e)
      setStatus('error')
      onError(msg)
    }
  }, [scenes, audioUrl, musicUrl, musicVolume, captionColor, topic, onComplete, onError])

  return (
    <div className="space-y-3">
      {/* Hidden canvas — rendering happens here */}
      <canvas
        ref={canvasRef}
        className="hidden"
        style={{width:'100%',aspectRatio:'9/16',borderRadius:'12px'}}
      />

      {status === 'idle' && (
        <button onClick={renderVideo}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>
          🎬 Render in Browser (Free)
        </button>
      )}

      {status === 'rendering' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/38">{statusText}</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-white/[0.07] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{width:`${progress}%`,background:'linear-gradient(90deg,#00c8ff,#7b2fff)'}}/>
          </div>
          <p className="text-[10px] text-white/20 text-center">
            Rendering at 30fps — keep this tab open · {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <button onClick={()=>{setStatus('idle');setProgress(0);setStatusText('')}}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{background:'linear-gradient(135deg,#ff4444,#ff6b35)'}}>
            🔄 Retry Render
          </button>
          <p className="text-[10px] text-white/25 text-center">
            Or use the Shotstack cloud option below
          </p>
        </div>
      )}

      {status === 'done' && (
        <button onClick={()=>{setStatus('idle');setProgress(0)}}
          className="w-full py-2 rounded-xl text-xs border border-white/[0.07] text-white/35 hover:text-white/55 transition-all">
          🔄 Re-render
        </button>
      )}
    </div>
  )
}