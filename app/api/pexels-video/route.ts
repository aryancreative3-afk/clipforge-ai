import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || 'nature'
  const perPage = searchParams.get('per_page') || '6'

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    // Return placeholder videos if no key
    const placeholders = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      url: `https://www.pexels.com/video/${1000 + i}/`,
      thumbnail: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/400/700`,
      duration: 10,
      width: 1080,
      height: 1920,
      videoFiles: [{ 
        link: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/400/700`,
        quality: 'sd',
        width: 1080,
        height: 1920,
      }],
      photographer: 'Placeholder',
      type: 'image' as const,
    }))
    return NextResponse.json({ videos: placeholders, isPlaceholder: true })
  }

  try {
    // Search for portrait videos (9:16 ratio)
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait&size=medium`,
      { headers: { Authorization: apiKey } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Pexels API error' }, { status: res.status })
    }

    const data = await res.json()
    const videos = (data.videos || []).map((v: any) => {
      // Get best quality portrait video file
      const files = v.video_files || []
      const portrait = files.find((f: any) => f.height > f.width) || files[0]
      const hd = files.find((f: any) => f.quality === 'hd' && f.height > f.width) || portrait
      
      return {
        id: v.id,
        url: v.url,
        thumbnail: v.image,
        duration: v.duration,
        width: v.width,
        height: v.height,
        videoFiles: files.filter((f: any) => f.link).slice(0, 3),
        bestUrl: hd?.link || portrait?.link || '',
        photographer: v.user?.name || '',
        type: 'video' as const,
      }
    })

    return NextResponse.json({ videos, total: data.total_results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}