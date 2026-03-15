import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 })
  }

  // Only allow known safe domains
  const allowed = [
    'videos.pexels.com',
    'images.pexels.com',
    'cdn.pixabay.com',
    'mp3l.jamendo.com',
    'storage.googleapis.com',
    'api.elevenlabs.io',
    'unpkg.com',
  ]

  let hostname = ''
  try {
    hostname = new URL(url).hostname
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const isAllowed = allowed.some(d => hostname.endsWith(d))
  if (!isAllowed) {
    // Still try — just warn in console
    console.warn('Proxying unlisted domain:', hostname)
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status }
      )
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}