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

// Proxy media through our own API to avoid CORS
async function proxyFetch(url: string): Promise<Uint8Array> {
  const res = await fetch(`/api/proxy-media?url=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
  const buf = await res.arrayBuffer()
  return new Uint8Array(buf)
}

export default function VideoRenderer({
  scenes, audioUrl, musicUrl, musicVolume, captionColor, topic, onComplete, onError
}: Props) {
  const [status, setStatus] = useState<'idle'|'loading'|'rendering'|'done'|'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const renderVideo = useCallback(async () => {
    setStatus('loading')
    setProgress(5)
    setStatusText('Loading FFmpeg…')

    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { toBlobURL } = await import('@ffmpeg/util')

      const ffmpeg = new FFmpeg()

      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
      })

      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(Math.round(30 + p * 60))
        setStatusText(
          p < 0.3 ? 'Processing scenes…' :
          p < 0.6 ? 'Encoding video…' :
          p < 0.9 ? 'Mixing audio…' : 'Finalising…'
        )
      })

      setStatusText('Loading FFmpeg core (first time may take ~30s)…')
      await ffmpeg.load({
        coreURL: await toBlobURL(
          'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
          'text/javascript'
        ),
        wasmURL: await toBlobURL(
          'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
          'application/wasm'
        ),
      })

      setProgress(15)
      setStatus('rendering')

      const inputs: string[] = []
      const filterParts: string[] = []
      const concatParts: string[] = []
      let inputIndex = 0

      // Download each scene
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i]
        const duration = Math.max(2, scene.durationSeconds || 5)
        setProgress(15 + Math.round((i / scenes.length) * 15))
        setStatusText(`Loading scene ${i + 1} of ${scenes.length}…`)

        if (scene.mediaUrl) {
          try {
            const data = await proxyFetch(scene.mediaUrl)
            const ext = scene.mediaType === 'image' ? 'jpg' : 'mp4'
            const fname = `scene_${i}.${ext}`
            await ffmpeg.writeFile(fname, data)
            inputs.push(fname)

            if (scene.mediaType === 'image') {
              filterParts.push(
                `[${inputIndex}:v]loop=loop=-1:size=1:start=0,` +
                `trim=duration=${duration},` +
                `scale=1080:1920:force_original_aspect_ratio=increase,` +
                `crop=1080:1920,setpts=PTS-STARTPTS,fps=30[v${i}]`
              )
            } else {
              filterParts.push(
                `[${inputIndex}:v]trim=duration=${duration},` +
                `scale=1080:1920:force_original_aspect_ratio=increase,` +
                `crop=1080:1920,setpts=PTS-STARTPTS,fps=30[v${i}]`
              )
            }
            concatParts.push(`[v${i}]`)
            inputIndex++
          } catch (err) {
            console.warn(`Scene ${i} media failed, using black:`, err)
            filterParts.push(
              `color=black:size=1080x1920:duration=${duration}:rate=30[v${i}]`
            )
            concatParts.push(`[v${i}]`)
          }
        } else {
          filterParts.push(
            `color=black:size=1080x1920:duration=${duration}:rate=30[v${i}]`
          )
          concatParts.push(`[v${i}]`)
        }
      }

      setProgress(32)
      setStatusText('Building video pipeline…')

      const ffArgs: string[] = []

      // Input files
      for (const inp of inputs) {
        if (inp.endsWith('.jpg') || inp.endsWith('.png')) {
          ffArgs.push('-loop', '1', '-i', inp)
        } else {
          ffArgs.push('-i', inp)
        }
      }

      // Voiceover
      let hasAudio = false
      if (audioUrl) {
        try {
          setStatusText('Loading voiceover…')
          const audioData = await proxyFetch(audioUrl)
          await ffmpeg.writeFile('voiceover.mp3', audioData)
          ffArgs.push('-i', 'voiceover.mp3')
          hasAudio = true
          inputIndex++
        } catch (err) {
          console.warn('Voiceover load failed:', err)
        }
      }

      // Background music
      let hasMusicAudio = false
      if (musicUrl) {
        try {
          setStatusText('Loading background music…')
          const musicData = await proxyFetch(musicUrl)
          await ffmpeg.writeFile('bgmusic.mp3', musicData)
          ffArgs.push('-i', 'bgmusic.mp3')
          hasMusicAudio = true
          inputIndex++
        } catch (err) {
          console.warn('Music load failed:', err)
        }
      }

      setProgress(45)
      setStatusText('Rendering video…')

      // Filter complex
      const concatFilter = `${concatParts.join('')}concat=n=${scenes.length}:v=1:a=0[outv]`
      let filterComplex = [...filterParts, concatFilter].join(';')

      let audioMapArgs: string[] = []

      if (hasAudio && hasMusicAudio) {
        const voiceIdx = inputs.length
        const musicIdx = inputs.length + 1
        filterComplex +=
          `;[${voiceIdx}:a]volume=1.0[voice]` +
          `;[${musicIdx}:a]volume=${musicVolume},aloop=loop=-1:size=2000000000[bgm]` +
          `;[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[outa]`
        audioMapArgs = ['-map', '[outa]']
      } else if (hasAudio) {
        audioMapArgs = ['-map', `${inputs.length}:a`]
      } else if (hasMusicAudio) {
        audioMapArgs = ['-map', `${inputs.length}:a`]
      }

      ffArgs.push('-filter_complex', filterComplex)
      ffArgs.push('-map', '[outv]')
      if (audioMapArgs.length) ffArgs.push(...audioMapArgs)
      ffArgs.push(
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '28',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-y',
        'output.mp4'
      )

      await ffmpeg.exec(ffArgs)

      setProgress(94)
      setStatusText('Preparing download…')

      const data = await ffmpeg.readFile('output.mp4') as Uint8Array
      const blob = new Blob([data], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setStatus('done')
      setStatusText('Done!')
      onComplete(url)

    } catch (e: any) {
      console.error('FFmpeg error:', e)
      setStatus('error')
      onError(e.message || 'FFmpeg render failed — check browser console for details')
    }
  }, [scenes, audioUrl, musicUrl, musicVolume, captionColor, topic, onComplete, onError])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="hidden"/>

      {status === 'idle' && (
        <button onClick={renderVideo}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{background:'linear-gradient(135deg,#00c8ff,#7b2fff)'}}>
          🎬 Render in Browser (Free)
        </button>
      )}

      {(status === 'loading' || status === 'rendering') && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/38">{statusText}</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-white/[0.07] rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${progress}%`,background:'linear-gradient(90deg,#00c8ff,#7b2fff)'}}/>
          </div>
          <p className="text-[10px] text-white/20 text-center">
            Rendering in your browser — do not close this tab
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
          <p className="text-[10px] text-white/25 text-center">Or try the Shotstack tab for cloud rendering</p>
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