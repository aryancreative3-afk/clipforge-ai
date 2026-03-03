import { NextRequest, NextResponse } from 'next/server'

// ElevenLabs voice IDs — these are real production voice IDs
export const ELEVENLABS_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'female', accent: 'American', style: 'Conversational' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', gender: 'male', accent: 'American', style: 'Conversational' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female', accent: 'British', style: 'Seductive' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'male', accent: 'American', style: 'Deep' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'female', accent: 'British', style: 'Warm' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', gender: 'male', accent: 'American', style: 'Friendly' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'female', accent: 'American', style: 'Expressive' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', gender: 'male', accent: 'Australian', style: 'Casual' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'female', accent: 'American', style: 'Warm' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', gender: 'male', accent: 'British', style: 'Authoritative' },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', gender: 'male', accent: 'American', style: 'Gruff' },
  { id: 'z9fAnlkpzviPz146aGWa', name: 'Glinda', gender: 'female', accent: 'American', style: 'Witch' },
]

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, stability = 0.5, similarityBoost = 0.75, style = 0.5, speed = 1.0 } = await req.json()

    if (!text || !voiceId) {
      return NextResponse.json({ error: 'Missing text or voiceId' }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'ELEVENLABS_API_KEY not set. Add it in Vercel → Settings → Environment Variables',
        fallback: true 
      }, { status: 500 })
    }

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: true,
          speed,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json({ 
        error: err?.detail?.message || `ElevenLabs error ${res.status}`,
        status: res.status
      }, { status: res.status })
    }

    // Return audio as base64 so frontend can play it
    const audioBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(audioBuffer).toString('base64')
    
    return NextResponse.json({ 
      audio: base64,
      mimeType: 'audio/mpeg',
      dataUrl: `data:audio/mpeg;base64,${base64}`
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Voice generation failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ voices: ELEVENLABS_VOICES })
}