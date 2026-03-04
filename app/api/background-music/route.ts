import { NextRequest, NextResponse } from 'next/server'

const GENRE_TAGS: Record<string, string> = {
  cinematic:     'cinematic orchestral',
  upbeat:        'upbeat energetic',
  lofi:          'lofi chill',
  dramatic:      'dramatic intense',
  inspirational: 'inspirational piano',
  corporate:     'corporate background',
  dark:          'dark ambient',
  happy:         'happy positive',
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

  const tags = GENRE_TAGS[resolvedGenre] || GENRE_TAGS['cinematic']

  const url = new URL('https://api.jamendo.com/v3.0/tracks/')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '10')
  url.searchParams.set('offset', offset)
  url.searchParams.set('tags', tags)
  url.searchParams.set('audioformat', 'mp31')
  url.searchParams.set('include', 'musicinfo')
  url.searchParams.set('groupby', 'artist_id')
  url.searchParams.set('order', 'popularity_total')
  url.searchParams.set('fuzzytags', '1')

  try {
    const r = await fetch(url.toString())
    const d = await r.json()

    if (d.headers?.status !== 'success') {
      return NextResponse.json(
        { error: d.headers?.error_message || 'Jamendo error' },
        { status: 500 }
      )
    }

    const tracks = (d.results || []).map((t: any) => ({
      id:       t.id,
      title:    t.name,
      artist:   t.artist_name,
      duration: parseInt(t.duration),
      audio:    t.audio,
      image:    t.album_image || t.image,
      genre:    resolvedGenre,
      license:  t.license_ccurl,
    }))

    return NextResponse.json({ tracks, genre: resolvedGenre })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}