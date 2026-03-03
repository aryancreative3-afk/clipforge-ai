import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // Vercel max for Pro plan

export async function POST(req: NextRequest) {
  try {
    const { scenes, audioBase64, captionStyle, captionColor, aspectRatio, title } = await req.json()

    if (!scenes || scenes.length === 0) {
      return NextResponse.json({ error: 'No scenes provided' }, { status: 400 })
    }

    // ── STEP 1: Fetch all scene images/videos from Pexels ──────────────────
    const pexelsKey = process.env.PEXELS_API_KEY
    const sceneMediaUrls: string[] = []

    for (const scene of scenes) {
      if (scene.customMediaUrl) {
        sceneMediaUrls.push(scene.customMediaUrl)
        continue
      }
      if (pexelsKey) {
        try {
          const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(scene.searchQuery)}&per_page=1&orientation=portrait`,
            { headers: { Authorization: pexelsKey } }
          )
          const data = await res.json()
          const photo = data.photos?.[0]
          if (photo) {
            sceneMediaUrls.push(photo.src.large)
            continue
          }
        } catch {}
      }
      // Fallback: use a gradient placeholder
      sceneMediaUrls.push(`https://picsum.photos/seed/${encodeURIComponent(scene.searchQuery)}/720/1280`)
    }

    // ── STEP 2: Return the assembled video data ────────────────────────────
    // In production this would use FFmpeg WASM or a render service
    // For now we return the scene data so the frontend can assemble with canvas
    return NextResponse.json({
      success: true,
      message: 'Video data ready — assembling in browser',
      sceneMediaUrls,
      scenes: scenes.map((s: any, i: number) => ({
        ...s,
        mediaUrl: sceneMediaUrls[i],
      })),
      metadata: {
        title,
        aspectRatio,
        captionStyle,
        captionColor,
        totalScenes: scenes.length,
      }
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Render failed' }, { status: 500 })
  }
}