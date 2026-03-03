import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { script, instruction } = await req.json()
    if (!script || !instruction) {
      return NextResponse.json({ error: 'Missing script or instruction' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables' }, { status: 500 })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a YouTube Shorts script editor. Apply the user's instruction to improve the script. 
Return the COMPLETE rewritten script in the same format:
🎬 HOOK (0–3s)
📖 STORY (3–50s)  
🎯 CTA (50–60s)
Return only the script, no commentary, no extra text.`,
        messages: [{ role: 'user', content: `Current script:\n${script}\n\nInstruction: ${instruction}` }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json({ error: err?.error?.message || `Anthropic API error ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    const result = data.content?.[0]?.text || ''
    return NextResponse.json({ result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}