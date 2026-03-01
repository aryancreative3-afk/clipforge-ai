import { NextResponse } from 'next/server'

function getMockResponse(userMessage: string, idea: string, style: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('hook') || msg.includes('dramatic')) {
    return `🎬 Here's a more dramatic hook:\n\n"3 seconds before liftoff — an astronaut whispered something NASA classified for 50 years. Until now."\n\nThis works because:\n✅ Specific detail feels real\n✅ Creates instant mystery\n✅ "Until now" builds urgency\n\nWant another variation?`
  }
  if (msg.includes('title')) {
    return `💡 5 viral title options:\n\n1. "The Secret NASA Classified for 50 Years"\n2. "What the Last Astronaut Really Saw"\n3. "Why No Human Has Returned — The Real Answer"\n4. "The Mission That Was Erased from History"\n5. "They Found Something. That's Why We Stopped."\n\n👉 My pick: Option 5 — biggest curiosity gap!`
  }
  if (msg.includes('viral') || msg.includes('score')) {
    return `📊 Viral Analysis:\n\n🎯 Hook Strength: 91/100\n⏱️ Pacing: 85/100\n💬 CTA Strength: 88/100\n📈 Trend Alignment: 94/100\n\n⭐ Overall: 89/100\n\n🔧 Top tip: Add a "Part 2" tease at the end — boosts follow rate by 60%!`
  }
  if (msg.includes('short') || msg.includes('45') || msg.includes('trim')) {
    return `✂️ Trimmed to under 45 seconds:\n\n🎬 HOOK (0-3s)\n"They found something on the moon. That's why we never went back."\n\n📖 STORY (3-38s)\n1972. The last humans on the moon.\nNASA had 3 more missions ready.\nAll cancelled overnight.\n\nThe official reason? Budget cuts.\nThe real reason is in classified documents.\n\n🎯 CTA (38-45s)\n"Follow for the truth. Drop 🌙 below."\n\n⏱️ Runtime: 43 seconds ✅`
  }
  if (msg.includes('cinematic')) {
    return `🎬 Rewritten in Cinematic style:\n\n🎬 HOOK\n"Houston... we have a problem. And it's not what they told you."\n\n📖 STORY\nThe year is 1972.\nTwelve men have walked on the moon.\nCernan is about to become the last.\n\nThree more missions cancelled.\nNo explanation. No warning.\n\nWhat did they find up there?\n\n🎯 CTA\n"Some doors, once opened, can never be closed. Follow."\n\n🎬 Cinematic score: 96/100`
  }
  if (msg.includes('cta') || msg.includes('emotion')) {
    return `❤️ 3 powerful CTA options:\n\n1️⃣ "If this is true... what else are they hiding? Follow for more. Drop 🌙"\n\n2️⃣ "Share this with someone who needs to know the truth. 🌙"\n\n3️⃣ "This might not stay up long. Follow before Part 2 drops. 🌙"\n\n👉 Best pick: Option 1 — converts 3x better!`
  }
  if (msg.includes('rewrite') || msg.includes('improve') || msg.includes('better')) {
    return `✍️ Improved version:\n\n🎬 HOOK (0-3s)\n"The last astronaut on the moon whispered something. NASA classified it immediately."\n\n📖 STORY (3-50s)\nDecember 1972. Apollo 17.\n\nThree more missions were ready.\nRockets built. Crews trained.\n\nThen — cancelled. All of them.\n\nThe FOIA documents show:\n→ Anomalies that don't match geology\n→ Signals with no known source\n→ Structures in empty areas\n\nThey didn't stop because it was expensive.\nThey stopped because of what they found.\n\n🎯 CTA\n"Follow for stories they don't want told. Drop 🌙"\n\n📈 Improvement: +23 viral points!`
  }

  return `🤖 Great question!\n\nFor ${style} Shorts, focus on:\n\n1. 🎯 Hook — 3 seconds to stop the scroll\n2. 📖 Story — build tension with every sentence\n3. 🔥 Emotion — make them feel something\n4. 📣 CTA — make them WANT to follow\n\nQuick wins:\n→ Add a specific number in your hook\n→ Cut any sentence that doesn't add tension\n→ End with an open loop for Part 2\n\nWant me to apply any of these directly?`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, idea, style, script } = body
    const lastUserMessage = messages?.filter((m: {role: string}) => m.role === 'user').pop()
    const userText = lastUserMessage?.text || ''

    // Try real Claude API first
    try {
      const Anthropic = require('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `You are ClipForge AI Agent — expert YouTube Shorts coach. Current Short: "${idea}" in ${style} style. Script: ${script}. Be concise, actionable, use emojis.`,
        messages: messages.map((m: {role: string, text: string}) => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.text
        }))
      })

      const reply = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ success: true, reply })

    } catch {
      const reply = getMockResponse(userText, idea || 'your Short', style || 'Educational')
      return NextResponse.json({ success: true, reply })
    }

  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json({
      success: true,
      reply: `🤖 I'm here to help! Try asking me:\n\n• "Make my hook more dramatic"\n• "Score my viral potential"\n• "Rewrite in Cinematic style"\n• "Make it under 45 seconds"`
    })
  }
}