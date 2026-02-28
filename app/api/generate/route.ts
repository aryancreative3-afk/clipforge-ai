import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { idea, style } = await req.json()
    
    // Debug: check if API key is loaded
    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key starts with:', apiKey?.slice(0, 10))
    console.log('Idea:', idea)
    console.log('Style:', style)

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key found' }, { status: 500 })
    }

    const Anthropic = require('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })
    
    console.log('Calling Claude API...')
    
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ 
        role: 'user', 
        content: 'Write a viral YouTube Short script about: ' + idea + '. Style: ' + style 
      }]
    })
    
    console.log('Claude response received!')
    const script = msg.content[0].text
    console.log('Script length:', script.length)

    return NextResponse.json({
      success: true,
      script,
      metadata: {
        title: idea.slice(0, 60),
        description: idea.slice(0, 150),
        tags: ['shorts', 'viral'],
        viralScore: 88,
        estimatedRuntime: '58 seconds'
      }
    })

  } catch (err) {
    console.error('FULL ERROR:', err)
    return NextResponse.json({ 
      error: 'Failed',
      details: String(err)
    }, { status: 500 })
  }
}