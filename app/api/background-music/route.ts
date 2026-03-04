import { NextRequest, NextResponse } from 'next/server'

const GENRE_QUERIES: Record<string, string> = {
  cinematic:    'cinematic epic orchestral',
  upbeat:       'upbeat energetic pop',
  lofi:         'lofi chill relaxing',
  dramatic:     'dramatic tense suspense',
  inspirational:'inspirational motivational piano',
  corporate:    'corporate background smooth',
  dark:         'dark ambient mysterious',
  happy:        'happy cheerful bright',
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
  const genre  = searchParams.get('genre') || 'cinematic'
  const style  = searchParams.get('style') || ''
  const page   = searchParams.get('page') || '1'

  const resolvedGenre = style && STYLE_GENRE_MAP[style] ? STYLE_GENRE_MAP[style] : genre
  const query = GENRE_QUERIES[resolvedGenre] || GENRE_QUERIES['cinematic']

  const key = process.env.PIXABAY_API_KEY
  if (!key) return NextResponse.json({ error: 'PIXABAY_API_KEY missing' }, { status: 500 })

  const url = `https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&video_type=music&per_page=10&page=${page}&safesearch=true`
  // Pixabay music endpoint
  const musicUrl = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&per_page=10&page=${page}&safesearch=true`

  try {
    // Use Pixabay music search
    const r = await fetch(
      `https://pixabay.com/api/music/?key=${key}&q=${encodeURIComponent(query)}&per_page=10&page=${page}`
    )
    const d = await r.json()
    const tracks = (d.hits || []).map((t: any) => ({
      id:       t.id,
      title:    t.title || t.tags?.split(',')[0] || 'Track',
      artist:   t.user || 'Unknown',
      duration: t.duration,
      url:      t.audio?.url || t.url,
      genre:    resolvedGenre,
    }))
    return NextResponse.json({ tracks, genre: resolvedGenre })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
```

---

## File 2 — Add `PIXABAY_API_KEY` to your `.env.local`
```
PIXABAY_API_KEY=your_key_here