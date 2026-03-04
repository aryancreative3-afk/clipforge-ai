import { NextRequest, NextResponse } from 'next/server'

const GENRE_QUERIES: Record<string, string> = {
  cinematic:     'cinematic',
  upbeat:        'upbeat',
  lofi:          'lofi',
  dramatic:      'dramatic',
  inspirational: 'inspirational',
  corporate:     'corporate',
  dark:          'dark',
  happy:         'happy',
}

const STYLE_GENRE_MAP: Record<string, string> = {
  viral:         'upbeat',
  educational:   'corporate',
  storytelling:  'cinematic',
  motivational:  'inspirational',
  documentary:   'cinematic',
  trending:      'upbeat',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const genre  = searchParams.get('genre') || 'auto'
  const style  = searchParams.get('style') || ''
  const offset = searchParams.get('offset') || '0'

  const clientId = process.env.JAMENDO_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'JAMENDO_CLIENT_ID missing' }, { status: 500 })
  }

  const resolvedGenre = genre === 'auto'
    ? (STYLE_GENRE_MAP[style] || 'cinematic')
    : genre

  const tag = GENRE_QUERIES[resolvedGenre] || 'cinematic'

  try {
    // Try 1: namesearch
    const url1 = new URL('https://api.jamendo.com/v3.0/tracks/')
    url1.searchParams.set('client_id', clientId)
    url1.searchParams.set('format', 'json')
    url1.searchParams.set('limit', '10')
    url1.searchParams.set('offset', offset)
    url1.searchParams.set('namesearch', tag)
    url1.searchParams.set('audioformat', 'mp31')
    url1.searchParams.set('order', 'popularity_total')

    const r1 = await fetch(url1.toString())
    const d1 = await r1.json()
    let results = Array.isArray(d1.results) ? d1.results : []

    // Try 2: tags
    if (results.length === 0) {
      const url2 = new URL('https://api.jamendo.com/v3.0/tracks/')
      url2.searchParams.set('client_id', clientId)
      url2.searchParams.set('format', 'json')
      url2.searchParams.set('limit', '10')
      url2.searchParams.set('offset', offset)
      url2.searchParams.set('tags', tag)
      url2.searchParams.set('audioformat', 'mp31')
      url2.searchParams.set('order', 'popularity_total')
      const r2 = await fetch(url2.toString())
      const d2 = await r2.json()
      results = Array.isArray(d2.results) ? d2.results : []
    }

    // Try 3: just popular tracks as fallback
    if (results.length === 0) {
      const url3 = new URL('https://api.jamendo.com/v3.0/tracks/')
      url3.searchParams.set('client_id', clientId)
      url3.searchParams.set('format', 'json')
      url3.searchParams.set('limit', '10')
      url3.searchParams.set('offset', offset)
      url3.searchParams.set('audioformat', 'mp31')
      url3.searchParams.set('order', 'popularity_total')
      const r3 = await fetch(url3.toString())
      const d3 = await r3.json()
      results = Array.isArray(d3.results) ? d3.results : []
    }

    const tracks = results.map((t: any) => ({
      id:       t.id,
      title:    t.name,
      artist:   t.artist_name,
      duration: parseInt(t.duration) || 0,
      audio:    t.audio,
      image:    t.album_image || t.image || null,
      genre:    resolvedGenre,
      license:  t.license_ccurl || '',
    }))

    return NextResponse.json({ tracks, genre: resolvedGenre })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}