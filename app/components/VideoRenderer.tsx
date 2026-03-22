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

    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')!

    try {
      // ── LOAD ALL MEDIA ────────────────────────────────────────────
      setStatusText('Loading scene media…')
      const sceneMedia: (HTMLVideoElement | HTMLImageElement | null)[] = []

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i]
        setProgress(2 + Math.round((i / scenes.length) * 20))
        setStatusText(`Loading scene ${i + 1} of ${scenes.length}…`)

        if (!scene.mediaUrl) { sceneMedia.push(null); continue }

        try {
          const proxied = `/api/proxy-media?url=${encodeURIComponent(scene.mediaUrl)}`
          if (scene.mediaType === 'image') {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            await new Promise<void>((res) => {
              img.onload = () => res()
              img.onerror = () => res()
              img.src = proxied
              setTimeout(res, 8000)
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
              vid.src = proxied
              vid.load()
              setTimeout(res, 10000)
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
        } catch (e) { console.warn('Voiceover failed:', e) }
      }

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
        } catch (e) { console.warn('Music failed:', e) }
      }

      // ── MEDIA RECORDER ────────────────────────────────────────────
      setProgress(30)
      setStatusText('Starting recorder…')

      const canvasStream = canvas.captureStream(30)
      dest.stream.getAudioTracks().forEach(t => canvasStream.addTrack(t))

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
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      // Start videos playing
      for (const m of sceneMedia) {
        if (m instanceof HTMLVideoElement) {
          m.currentTime = 0
          m.play().catch(() => {})
        }
      }

      // Start recording with 1s intervals to collect data
      recorder.start(1000)

      // ── RENDER FRAMES ─────────────────────────────────────────────
      const FPS = 30
      const allFrames = scenes.reduce((s, sc) => s + Math.round((sc.durationSeconds || 5) * FPS), 0)
      let totalFrames = 0

      for (let si = 0; si < scenes.length; si++) {
        const scene = scenes[si]
        const media = sceneMedia[si]
        const duration = scene.durationSeconds || 5
        const frames = Math.round(duration * FPS)

        if (media instanceof HTMLVideoElement) {
          media.currentTime = 0
          await new Promise<void>(r => setTimeout(r, 150))
        }

        for (let f = 0; f < frames; f++) {
          // Black background
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, 1080, 1920)

          // Draw media
          if (media instanceof HTMLImageElement && media.complete && media.naturalWidth > 0) {
            const scale = Math.max(1080 / media.naturalWidth, 1920 / media.naturalHeight)
            const w = media.naturalWidth * scale
            const h = media.naturalHeight * scale
            ctx.drawImage(media, (1080 - w) / 2, (1920 - h) / 2, w, h)
          } else if (media instanceof HTMLVideoElement && media.readyState >= 2) {
            const scale = Math.max(1080 / (media.videoWidth || 1), 1920 / (media.videoHeight || 1))
            const w = (media.videoWidth || 1080) * scale
            const h = (media.videoHeight || 1920) * scale
            ctx.drawImage(media, (1080 - w) / 2, (1920 - h) / 2, w, h)
          }

          // Draw caption
          if (scene.text) {
            const fontSize = 68
            ctx.font = `bold ${fontSize}px Arial, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            const words = scene.text.split(' ')
            const lines: string[] = []
            let line = ''
            const maxWidth = 880
            for (const word of words) {
              const test = line ? `${line} ${word}` : word
              if (ctx.measureText(test).width > maxWidth && line) {
                lines.push(line); line = word
              } else { line = test }
            }
            if (line) lines.push(line)

            const lineH = fontSize * 1.35
            const totalH = lines.length * lineH
            const startY = 1920 * 0.78 - totalH / 2

            // Background
            ctx.fillStyle = 'rgba(0,0,0,0.55)'
            ctx.beginPath()
            ctx.roundRect(1080/2 - maxWidth/2 - 36, startY - 18, maxWidth + 72, totalH + 36, 18)
            ctx.fill()

            // Text
            ctx.shadowColor = 'rgba(0,0,0,0.9)'
            ctx.shadowBlur = 10
            ctx.fillStyle = captionColor || '#ffffff'
            lines.forEach((l, li) => {
              ctx.fillText(l, 1080 / 2, startY + li * lineH + fontSize / 2)
            })
            ctx.shadowBlur = 0
          }

          totalFrames++
          if (f % 15 === 0) {
            setProgress(Math.min(30 + Math.round((totalFrames / allFrames) * 60), 89))
            setStatusText(`Scene ${si + 1}/${scenes.length} · ${Math.round(f / FPS)}s`)
          }

          await new Promise<void>(r => setTimeout(r, 1000 / FPS))
        }
      }

      // ── STOP & EXPORT ─────────────────────────────────────────────
      setProgress(90)
      setStatusText('Finalising video…')

      // Request any remaining data
      if (recorder.state === 'recording') recorder.requestData()
      await new Promise<void>(r => setTimeout(r, 800))

      // Stop recorder and wait for all data
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve()
        if (recorder.state !== 'inactive') recorder.stop()
        else resolve()
      })

      await new Promise<void>(r => setTimeout(r, 300))
      audioCtx.close()

      setProgress(96)
      setStatusText('Creating download…')

      if (chunks.length === 0) {
        throw new Error('No video data recorded — browser may not support MediaRecorder')
      }

      const blob = new Blob(chunks, { type: mimeType })
      if (blob.size === 0) {
        throw new Error('Video file is empty — try a different browser')
      }

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
      {/* Canvas positioned off-screen — must not be display:none for captureStream to work */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
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
            Rendering at 30fps · keep this tab open
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
          <p className="text-[10px] text-white/25 text-center">Or use Shotstack cloud below</p>
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