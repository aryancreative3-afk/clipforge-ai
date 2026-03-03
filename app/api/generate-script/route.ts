import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { idea, style, action } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables' }, { status: 500 })
    }

    // ── GENERATE SCRIPT ──────────────────────────────────────────────────────
    if (action === 'script') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          system: `You are ClipForge AI, an expert YouTube Shorts scriptwriter. Write viral, high-retention scripts for YouTube Shorts (under 60 seconds).

ALWAYS return valid JSON in this exact format:
{
  "script": "full script text with hook/story/cta sections",
  "scenes": [
    { "id": 1, "timestamp": "0-3s", "text": "scene narration text", "searchQuery": "pexels search term", "type": "hook" },
    { "id": 2, "timestamp": "3-15s", "text": "scene narration text", "searchQuery": "pexels search term", "type": "story" },
    ...
  ],
  "title": "catchy video title under 60 chars",
  "hashtags": "#shorts #viral #youtube"
}

Rules for scenes:
- Split script into 4-6 scenes
- Each scene has a specific pexels searchQuery (2-3 words, visual, concrete)
- searchQuery should match the visual content of that scene
- type is one of: hook, story, cta
- Return ONLY the JSON, no other text`,
          messages: [{ role: 'user', content: `Write a ${style} YouTube Short script about: ${idea}` }],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return NextResponse.json({ error: err?.error?.message || `API error ${res.status}` }, { status: res.status })
      }

      const data = await res.json()
      const text = data.content?.[0]?.text || '{}'
      try {
        const clean = text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        return NextResponse.json({ success: true, ...parsed })
      } catch {
        return NextResponse.json({ error: 'Failed to parse script JSON', raw: text }, { status: 500 })
      }
    }

    // ── SCORE SCRIPT ─────────────────────────────────────────────────────────
    if (action === 'score') {
      const { script } = await req.json().catch(() => ({ script: '' }))
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          system: 'You are a viral content analyst. Return ONLY a JSON object: {"score": NUMBER, "reason": "one sentence"}. Score range 60-99.',
          messages: [{ role: 'user', content: `Score this YouTube Short script:\n\nTopic: ${idea}\nStyle: ${style}\n\n${script}` }],
        }),
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || '{"score":75,"reason":"Average viral potential"}'
      try {
        const clean = text.replace(/```json|```/g, '').trim()
        return NextResponse.json(JSON.parse(clean))
      } catch {
        return NextResponse.json({ score: 75, reason: 'Good viral potential' })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}