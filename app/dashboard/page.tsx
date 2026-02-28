'use client'
import { useState } from 'react'
import Link from 'next/link'

const styles = [
  { id: 'Educational', emoji: '🎓', desc: 'Facts & insights' },
  { id: 'Motivational', emoji: '🔥', desc: 'Inspire & energize' },
  { id: 'Cinematic', emoji: '🎬', desc: 'Story-driven' },
  { id: 'Trending', emoji: '📈', desc: 'Viral & topical' },
  { id: 'Storytelling', emoji: '📖', desc: 'Narrative arc' },
]

const pipeline = [
  { id: 1, icon: '✍️', label: 'Writing Script',      desc: 'Crafting your hook, story and CTA' },
  { id: 2, icon: '🎙️', label: 'Generating Voice',    desc: 'Converting script to natural speech' },
  { id: 3, icon: '🎬', label: 'Creating Visuals',    desc: 'Generating cinematic video clips' },
  { id: 4, icon: '💬', label: 'Adding Captions',     desc: 'Syncing word-by-word captions' },
  { id: 5, icon: '🎵', label: 'Scoring Music',       desc: 'Composing mood-matched background' },
  { id: 6, icon: '🚀', label: 'Final Assembly',      desc: 'Merging all elements into MP4' },
]

const recentShorts = [
  { title: 'Why Tesla was misunderstood', style: 'Educational', score: 91, date: '2 days ago', status: 'Published' },
  { title: 'The moon landing conspiracy', style: 'Cinematic',   score: 87, date: '4 days ago', status: 'Published' },
  { title: '5 habits of millionaires',    style: 'Motivational', score: 94, date: '1 week ago', status: 'Draft' },
]

export default function Dashboard() {
  const [idea, setIdea] = useState('')
  const [style, setStyle] = useState('Educational')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)
  const [script, setScript] = useState('')
  const [showScript, setShowScript] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')

  const metadata = {
    viralScore: 88,
    estimatedRuntime: '58 seconds',
  }

  async function handleGenerate() {
    if (!idea.trim()) return
    setIsGenerating(true)
    setDone(false)
    setCurrentStep(0)
    setScript('')

    for (let i = 1; i <= pipeline.length; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, 1400))
    }

    setScript(`🎬 HOOK (0–3s)
"Most people will never know the real reason we stopped going to the moon."

📖 STORY (3–50s)
It wasn't budget cuts. It wasn't politics.

The truth is far more unsettling.

After Apollo 17 in 1972, NASA had everything ready for Apollo 18, 19, and 20.
The rockets were built. The astronauts were trained. The missions were planned.

Then suddenly — all three were cancelled.

Here's what they don't teach you:
The missions were scrapped not because we couldn't go back...
but because of what we found when we got there.

Unexplained structures. Anomalous signals. Data that didn't fit the official story.

The declassified documents exist. The whistleblowers have spoken.

And yet — silence.

🎯 CTA (50–60s)
"Follow for more stories they don't want you to know. Drop a 🌙 if this blew your mind."`)

    setIsGenerating(false)
    setDone(true)
  }

  function handleReset() {
    setIdea('')
    setCurrentStep(0)
    setDone(false)
    setIsGenerating(false)
    setScript('')
    setShowScript(false)
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white flex flex-col">

      {/* TOP NAV */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">C</div>
          <span className="font-black text-xl">ClipForge AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'create' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
            ⚡ Create
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
            📁 My Shorts
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#00c8ff]/10 border border-[#00c8ff]/20 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse" />
            <span className="text-xs text-[#00c8ff] font-semibold">3 free Shorts left</span>
          </div>
          <Link href="/settings" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black hover:opacity-80 transition-all">A</Link>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">

        {/* ===== CREATE TAB ===== */}
        {activeTab === 'create' && (
          <>
            {/* INPUT */}
            {!isGenerating && !done && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-black mb-3">What's your Short about?</h1>
                  <p className="text-gray-400 text-lg">Type your idea — ClipForge handles the rest.</p>
                </div>

                {/* Idea box */}
                <div className="mb-6">
                  <textarea
                    value={idea}
                    onChange={e => setIdea(e.target.value.slice(0, 200))}
                    placeholder="e.g. Why Nikola Tesla was the most misunderstood genius in history..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 text-lg resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">Be specific for better results</span>
                    <span className={`text-xs ${idea.length > 180 ? 'text-red-400' : 'text-gray-500'}`}>{idea.length}/200</span>
                  </div>
                </div>

                {/* Style selector */}
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">Choose Style</p>
                  <div className="grid grid-cols-5 gap-3">
                    {styles.map(s => (
                      <button key={s.id} onClick={() => setStyle(s.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${style === s.id ? 'bg-[#00c8ff]/10 border-[#00c8ff] text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-xs font-semibold">{s.id}</span>
                        <span className="text-[10px] text-gray-500">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <button onClick={handleGenerate} disabled={!idea.trim()}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black text-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]">
                  ⚡ Generate My Short
                </button>

                <p className="text-center text-gray-600 text-sm mt-4">Takes about 10 seconds · No editing required</p>
              </div>
            )}

            {/* PIPELINE */}
            {isGenerating && (
              <div>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">⚡</div>
                  <h2 className="text-3xl font-black mb-2">Creating your Short...</h2>
                  <p className="text-gray-400">"{idea.slice(0, 50)}{idea.length > 50 ? '...' : ''}"</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-1 mb-8">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] transition-all duration-500"
                    style={{ width: `${(currentStep / pipeline.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {pipeline.map((step) => {
                    const status = currentStep > step.id ? 'done' : currentStep === step.id ? 'active' : 'waiting'
                    return (
                      <div key={step.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${status === 'done' ? 'border-green-500/30 bg-green-500/5' : status === 'active' ? 'border-[#00c8ff]/50 bg-[#00c8ff]/5' : 'border-white/5 bg-white/[0.02]'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border transition-all ${status === 'done' ? 'border-green-500 bg-green-500/20' : status === 'active' ? 'border-[#00c8ff] bg-[#00c8ff]/20 animate-pulse' : 'border-white/10'}`}>
                          {status === 'done' ? '✓' : step.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${status === 'done' ? 'text-green-400' : status === 'active' ? 'text-[#00c8ff]' : 'text-gray-500'}`}>{step.label}</div>
                          <div className="text-xs text-gray-600">{step.desc}</div>
                        </div>
                        {status === 'active' && <span className="text-xs text-[#00c8ff] animate-pulse">Processing...</span>}
                        {status === 'done' && <span className="text-xs text-green-400">✓ Done</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* DONE */}
            {done && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-4xl mx-auto mb-4">✓</div>
                  <h2 className="text-4xl font-black mb-2">Your Short is ready!</h2>
                  <p className="text-gray-400 text-sm">"{idea.slice(0, 60)}{idea.length > 60 ? '...' : ''}"</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-[#00c8ff]">{metadata.viralScore}</div>
                    <div className="text-xs text-gray-400 mt-1">Viral Score</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-xl font-black text-[#7b2fff]">{metadata.estimatedRuntime}</div>
                    <div className="text-xs text-gray-400 mt-1">Runtime</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-xl font-black text-green-400">{style}</div>
                    <div className="text-xs text-gray-400 mt-1">Style</div>
                  </div>
                </div>

                {/* Video preview placeholder */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-6">
                  <div className="w-24 h-40 rounded-xl bg-gradient-to-b from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-4xl">🎬</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">{idea.slice(0, 50)}</div>
                    <div className="text-sm text-gray-400 mb-3">1080 × 1920 · MP4 · {style}</div>
                    <div className="flex flex-wrap gap-2">
                      {['#shorts', '#viral', `#${style.toLowerCase()}`].map(tag => (
                        <span key={tag} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Script accordion */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
                  <button onClick={() => setShowScript(!showScript)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                    <span className="font-bold">✍️ View Generated Script</span>
                    <span className="text-gray-400 text-sm">{showScript ? '▲ Hide' : '▼ Show'}</span>
                  </button>
                  {showScript && (
                    <div className="px-6 pb-6 border-t border-white/10">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed mt-4 font-mono">{script}</pre>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all">
                    📺 Upload to YouTube
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 font-bold py-4 rounded-xl transition-all">
                    ⬇️ Download MP4
                  </button>
                  <button onClick={handleReset} className="border border-white/20 hover:border-white/40 text-gray-300 font-semibold py-4 rounded-xl transition-all">
                    + New Short
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black">My Shorts</h2>
                <p className="text-gray-400 mt-1">Your generated content library</p>
              </div>
              <button onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-all">
                + New Short
              </button>
            </div>

            <div className="space-y-4">
              {recentShorts.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 hover:border-white/20 transition-all">
                  <div className="w-12 h-20 rounded-lg bg-gradient-to-b from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center shrink-0">
                    🎬
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">{s.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{s.style}</span>
                      <span>Viral Score: <span className="text-[#00c8ff] font-bold">{s.score}</span></span>
                      <span>{s.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {s.status}
                    </span>
                    <button className="text-gray-400 hover:text-white text-xs border border-white/10 rounded-full px-3 py-1 transition-all">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#00c8ff]">3</div>
                <div className="text-xs text-gray-400 mt-1">Total Shorts</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-400">2</div>
                <div className="text-xs text-gray-400 mt-1">Published</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-[#7b2fff]">91</div>
                <div className="text-xs text-gray-400 mt-1">Avg Viral Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}