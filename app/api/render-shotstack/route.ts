import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const key = process.env.SHOTSTACK_API_KEY
  if (!key) return NextResponse.json({ error: 'SHOTSTACK_API_KEY missing' }, { status: 500 })

  const { scenes, audioUrl, musicUrl, musicVolume, captionColor, title } = await req.json()

  // Build timeline tracks
  let currentTime = 0
  const videoClips: any[] = []
  const textClips: any[] = []

  for (const scene of scenes) {
    const duration = scene.durationSeconds || 5

    // Video clip
    if (scene.mediaUrl) {
      videoClips.push({
        asset: {
          type: scene.mediaType === 'image' ? 'image' : 'video',
          src: scene.mediaUrl,
          ...(scene.mediaType === 'video' ? { trim: 0, volume: 0 } : {}),
        },
        start: currentTime,
        length: duration,
        fit: 'cover',
        effect: 'zoomIn',
      })
    }

    // Caption text
    if (scene.text) {
      textClips.push({
        asset: {
          type: 'html',
          html: `<p>${scene.text}</p>`,
          css: `p { font-family: 'Arial'; color: ${captionColor || '#ffffff'}; font-size: 52px; font-weight: bold; text-align: center; text-shadow: 2px 2px 8px rgba(0,0,0,0.8); }`,
          width: 900,
          height: 300,
        },
        start: currentTime,
        length: duration,
        position: 'bottom',
        offset: { y: 0.15 },
        transition: { in: 'fade', out: 'fade' },
      })
    }

    currentTime += duration
  }

  // Build tracks array
  const tracks: any[] = [
    { clips: textClips },
    { clips: videoClips },
  ]

  // Soundtrack — voiceover + background music
  const timeline: any = {
    background: '#000000',
    tracks,
  }

  if (audioUrl) {
    timeline.soundtrack = {
      src: audioUrl,
      effect: 'fadeOut',
      volume: 1.0,
    }
  }

  if (musicUrl) {
    // Add music as a separate audio track at lower volume
    tracks.unshift({
      clips: [{
        asset: {
          type: 'audio',
          src: musicUrl,
          volume: musicVolume || 0.18,
          effect: 'fadeInFadeOut',
        },
        start: 0,
        length: currentTime,
      }],
    })
  }

  const payload = {
    timeline,
    output: {
      format: 'mp4',
      resolution: 'hd',
      aspectRatio: '9:16',
      size: { width: 1080, height: 1920 },
      fps: 30,
    },
  }

  try {
    // Submit render
    const r = await fetch('https://api.shotstack.io/v1/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
      },
      body: JSON.stringify(payload),
    })
    const d = await r.json()
    if (!r.ok) return NextResponse.json({ error: d.message || 'Shotstack error' }, { status: 500 })
    return NextResponse.json({ renderId: d.response?.id, provider: 'shotstack' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const key = process.env.SHOTSTACK_API_KEY
  if (!key) return NextResponse.json({ error: 'SHOTSTACK_API_KEY missing' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const renderId = searchParams.get('renderId')
  if (!renderId) return NextResponse.json({ error: 'renderId required' }, { status: 400 })

  try {
    const r = await fetch(`https://api.shotstack.io/v1/render/${renderId}`, {
      headers: { 'x-api-key': key },
    })
    const d = await r.json()
    const status = d.response?.status
    const url = d.response?.url

    return NextResponse.json({
      done: status === 'done',
      failed: status === 'failed',
      status,
      outputFile: url || null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}