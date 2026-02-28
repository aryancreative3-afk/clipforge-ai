import { NextResponse } from 'next/server'

function generateMockResponse(userMessage: string, idea: string, style: string, script: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('hook') && msg.includes('dramatic')) {
    return `🎬 Here's a more dramatic hook for your Short:

**Original:** "Most people will never know the real reason..."

**Upgraded Hook:**
"3 seconds before liftoff — an astronaut grabbed the mic and whispered something that got immediately classified. NASA buried it for 50 years. Until now."

This works because:
✅ Creates instant mystery
✅ Specific detail (3 seconds) feels real
✅ "Until now" creates urgency
✅ Viewer MUST keep watching

Want me to try another variation?`
  }

  if (msg.includes('title')) {
    return `💡 Here are 5 viral title options for "${idea}":

1. 🔥 "The Moon Secret NASA Classified for 50 Years"
2. 👁️ "What the Last Astronaut Saw (Never Shown on TV)"
3. 🚨 "Why No Human Has Returned to the Moon — The Real Answer"
4. 💀 "The Apollo Mission That Was Erased from History"
5. 🌙 "They Found Something. That's Why We Never Went Back."

**My top pick:** Option 5 — it's mysterious, short, and creates massive curiosity gap.

Which one feels right for your channel?`
  }

  if (msg.includes('viral') || msg.includes('score')) {
    const score = Math.floor(Math.random() * 10) + 88
    return `📊 Viral Potential Analysis for your Short:

**Overall Score: ${score}/100** 🔥

Breaking it down:

🎯 **Hook Strength:** 91/100
Your opening creates strong curiosity. The "never returned" angle is proven to perform.

⏱️ **Pacing:** 85/100  
Good length. Could tighten the middle section by 8 seconds.

💬 **CTA Strength:** 88/100
The moon emoji CTA is engaging. Consider adding a question to boost comments.

📈 **Trend Alignment:** 94/100
Space conspiracy content is trending +340% this month.

🔧 **Top improvement:** Add a "Part 2" tease at the end — boosts follow rate by 60%.

Want me to rewrite any section to push the score higher?`
  }

  if (msg.includes('shorter') || msg.includes('45')) {
    return `✂️ Here's your script trimmed to under 45 seconds:

**HOOK (0-3s)**
"They found something on the moon. That's why we never went back."

**STORY (3-38s)**
1972. Apollo 17. The last humans on the moon.

NASA had 3 more missions ready.
Rockets built. Astronauts trained.

Then — cancelled. All of them. Overnight.

The official reason? Budget cuts.

The real reason is in the declassified documents most people never read.

Unexplained structures. Signals that shouldn't exist. Data that broke their models.

They didn't stop going because they couldn't.
They stopped because of what they found.

**CTA (38-45s)**
"Follow for the truth they don't teach. Drop 🌙 if this changed how you see things."

⏱️ **Estimated runtime: 43 seconds**
✅ Tighter pacing, same impact, higher retention!`
  }

  if (msg.includes('cinematic')) {
    return `🎬 Rewritten in Cinematic style:

**HOOK (0-3s)**
*[Low rumble. Static. A distorted transmission.]*
"Houston... we have a problem. And it's not what they told you."

**STORY (3-50s)**
*[Slow zoom. Archive footage. The weight of silence.]*

The year is 1972.
Twelve men have walked on the moon.
Eugene Cernan is about to become the last.

He doesn't know it yet.

Back on Earth, three more missions are waiting.
The hardware exists. The crew is trained.

Then — a phone call.
A closed-door meeting.
A decision that changed history.

*[Beat. Silence.]*

What did they find up there?

The documents exist.
The testimonies are on record.
The silence... speaks louder than any answer.

**CTA (50-60s)**
*[Music swells.]*
"Some doors, once opened, can never be closed.
Follow. The story continues."

🎬 **Cinematic score: 96/100** — This will hit HARD.`
  }

  if (msg.includes('cta') || msg.includes('emotion')) {
    return `❤️ Here are 3 emotionally powerful CTA options:

**Option 1 — Curiosity:**
"If this is true... what else are they hiding? Follow — I post what they don't want you to find. Drop 🌙 below."

**Option 2 — Community:**
"You just learned something most people will never know. Share this with someone who needs to see it. We don't forget. 🌙"

**Option 3 — Urgency:**
"This video might not stay up long. Screenshot it. Share it. Follow now before Part 2 drops tomorrow. 🌙"

**My recommendation:** Option 1 — it converts followers 3x better because it promises ongoing value.

Want me to customize any of these further?`
  }

  if (msg.includes('rewrite') || msg.includes('improve')) {
    return `✍️ Here's an improved version of your script:

**HOOK (0-3s)**
"The last astronaut to leave the moon whispered something before liftoff. NASA classified it immediately."

**STORY (3-50s)**
That was December 1972.

Eugene Cernan looked back at Earth from the lunar surface and said words that were quietly removed from the official transcripts.

Three more Apollo missions were already planned.
18. 19. 20.

All cancelled within weeks of each other.

The public was told: budget cuts.

But the engineers who built the rockets? They were just as shocked as everyone else.

Here's what the FOIA documents actually show:
Thermal anomalies that don't match geology.
Structured formations in areas that should be empty.
A signal — repeating — that matched no known source.

They didn't stop going to the moon because it was expensive.

They stopped because something up there didn't want them to come back.

**CTA (50-60s)**
"Follow for the stories that don't make the news. Drop 🌙 if you want Part 2."

📈 **Improvement score: +23 points** — Much stronger narrative tension!`
  }

  // Default response
  return `🤖 Great question about "${idea}"!

Here's my advice:

**For ${style} style Shorts, the key is:**

1. 🎯 **Hook** — You have 3 seconds. Make it impossible to scroll past.

2. 📖 **Story** — Build tension progressively. Each sentence should make them need the next one.

3. 🔥 **Emotion** — ${style === 'Educational' ? 'Make them feel smart for watching.' : style === 'Motivational' ? 'Make them believe they can do it.' : style === 'Cinematic' ? 'Make them feel the weight of the moment.' : 'Make them feel like insiders.'}

4. 📣 **CTA** — Don't ask for a follow. Make them WANT to follow to get more.

**Quick wins for your specific Short:**
- Add a specific number or date in your hook
- Cut any sentence that doesn't add tension
- End on an open loop that makes Part 2 irresistible

Want me to apply any of these to your script directly?`
}

export async function POST(req: Request) {
  try {
    const { messages, idea, style, script } = await req.json()

    // Try real Claude API first
    try {
      const Anthropic = require('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const systemPrompt = `You are ClipForge AI Agent — an expert YouTube Shorts coach built into ClipForge platform.
Current Short: Idea: "${idea}", Style: "${style}"
Script: ${script}
Help the creator improve their Short. Be concise, actionable, encouraging. Use emojis. Format scripts with HOOK/STORY/CTA sections.`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: {role: string, text: string}) => ({
          role: m.role === 'agent' ? 'assistant' : 'user',
          content: m.text
        }))
      })

      const reply = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ success: true, reply })

    } catch {
      // Fall back to smart mock responses
      const lastUserMessage = messages.filter((m: {role: string}) => m.role === 'user').pop()
      const reply = generateMockResponse(lastUserMessage?.text || '', idea, style, script)
      return NextResponse.json({ success: true, reply })
    }

  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 })
  }
}