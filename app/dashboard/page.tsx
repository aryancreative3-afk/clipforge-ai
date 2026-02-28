'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const styles = [
  { id: 'Educational', emoji: '🎓' },
  { id: 'Motivational', emoji: '🔥' },
  { id: 'Cinematic', emoji: '🎬' },
  { id: 'Trending', emoji: '📈' },
  { id: 'Storytelling', emoji: '📖' },
]

const pipeline = [
  { id: 1, icon: '✍️', label: 'Writing Script', desc: 'Crafting hook, story and CTA' },
  { id: 2, icon: '🎙️', label: 'Generating Voice', desc: 'Converting script to speech' },
  { id: 3, icon: '🎬', label: 'Creating Visuals', desc: 'Generating cinematic clips' },
  { id: 4, icon: '💬', label: 'Adding Captions', desc: 'Syncing word-by-word captions' },
  { id: 5, icon: '🎵', label: 'Scoring Music', desc: 'Composing background score' },
  { id: 6, icon: '🚀', label: 'Final Assembly', desc: 'Merging all elements into MP4' },
]

const voices = ['Nova ♀', 'Echo ♂', 'Aria ♀', 'Orion ♂', 'Sage ♀', 'Atlas ♂']

const thumbnailTemplates = [
  { id: 1, bg: 'from-red-600 to-orange-500', label: 'Bold Red' },
  { id: 2, bg: 'from-blue-600 to-cyan-400', label: 'Ocean Blue' },
  { id: 3, bg: 'from-purple-600 to-pink-500', label: 'Purple Pop' },
  { id: 4, bg: 'from-green-600 to-emerald-400', label: 'Nature' },
  { id: 5, bg: 'from-yellow-500 to-orange-400', label: 'Sunshine' },
  { id: 6, bg: 'from-gray-800 to-gray-600', label: 'Dark Pro' },
]

const agentSuggestions = [
  '🎬 Make hook more dramatic',
  '💡 Suggest better title',
  '📊 Score my viral potential',
  '✂️ Make it under 45 seconds',
  '🔥 Rewrite in Cinematic style',
  '📣 Stronger CTA please',
]

const recentShorts = [
  { title: 'Why Tesla was misunderstood', style: 'Educational', score: 91, date: '2 days ago', status: 'Published' },
  { title: 'The moon landing conspiracy', style: 'Cinematic', score: 87, date: '4 days ago', status: 'Published' },
  { title: '5 habits of millionaires', style: 'Motivational', score: 94, date: '1 week ago', status: 'Draft' },
]

const mockScript = `🎬 HOOK (0–3s)
"Most people will never know the real reason we stopped going to the moon."

📖 STORY (3–50s)
It wasn't budget cuts. It wasn't politics.
The truth is far more unsettling.

After Apollo 17 in 1972, NASA had everything ready.
The rockets were built. The astronauts were trained.
Then suddenly — all three missions were cancelled.

Here's what they don't teach you:
The missions were scrapped not because we couldn't go back...
but because of what we found when we got there.

Unexplained structures. Anomalous signals.
Data that didn't fit the official story.

The declassified documents exist.
The whistleblowers have spoken.
And yet — silence.

🎯 CTA (50–60s)
"Follow for more stories they don't want you to know.
Drop a 🌙 if this blew your mind."`

export default function Dashboard() {
  const [idea, setIdea] = useState('')
  const [style, setStyle] = useState('Educational')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')
  const [activeEditorTab, setActiveEditorTab] = useState<'video' | 'captions' | 'voice' | 'thumbnail' | 'export'>('video')

  // Editor state
  const [script, setScript] = useState(mockScript)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [speed, setSpeed] = useState(1)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [captionColor, setCaptionColor] = useState('#ffffff')
  const [captionSize, setCaptionSize] = useState('large')
  const [captionStyle, setCaptionStyle] = useState('word-by-word')
  const [selectedVoice, setSelectedVoice] = useState('Nova ♀')
  const [voicePitch, setVoicePitch] = useState(50)
  const [voiceSpeed, setVoiceSpeed] = useState(50)
  const [selectedThumb, setSelectedThumb] = useState(1)
  const [thumbTitle, setThumbTitle] = useState('The REAL Reason We Never Returned')
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [uploadToYT, setUploadToYT] = useState(false)
  const [ytTitle, setYtTitle] = useState('')
  const [ytDesc, setYtDesc] = useState('')

  // AI Agent state
  const [agentOpen, setAgentOpen] = useState(false)
  const [agentMessages, setAgentMessages] = useState([
    { role: 'agent', text: "Hi! I'm your ClipForge AI Agent 🤖 I can help you refine your script, change the style, improve your hook, or answer any questions. What would you like to improve?" }
  ])
  const [agentInput, setAgentInput] = useState('')
  const [agentTyping, setAgentTyping] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleGenerate() {
    if (!idea.trim()) return
    setIsGenerating(true)
    setDone(false)
    setCurrentStep(0)
    for (let i = 1; i <= pipeline.length; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, 1400))
    }
    setYtTitle(idea.slice(0, 60))
    setYtDesc(`A ${style} YouTube Short about: ${idea}`)
    setIsGenerating(false)
    setDone(true)
  }

  function handleReset() {
    setIdea('')
    setCurrentStep(0)
    setDone(false)
    setIsGenerating(false)
  }

async function handleAgentSend(msg?: string) {
  const text = msg || agentInput
  if (!text.trim()) return

  const newUserMsg = { role: 'user', text }
  const updatedMessages = [...agentMessages, newUserMsg]
  
  setAgentMessages(updatedMessages)
  setAgentInput('')
  setAgentTyping(true)

  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedMessages,
        script,
        idea,
        style
      })
    })

    const data = await res.json()

    if (data.reply) {
      setAgentMessages(prev => [...prev, { role: 'agent', text: data.reply }])
    } else {
      setAgentMessages(prev => [...prev, { 
        role: 'agent', 
        text: '⚠️ Agent unavailable right now. Please add Anthropic API credits to activate.' 
      }])
    }
  } catch {
    setAgentMessages(prev => [...prev, { 
      role: 'agent', 
      text: '⚠️ Connection error. Please try again.' 
    }])
  }

  setAgentTyping(false)
}

  return (
    <div className="min-h-screen bg-[#050d1a] text-white flex flex-col">

      {/* NAV */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center justify-between shrink-0 sticky top-0 z-40 bg-[#050d1a]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">C</div>
          <span className="font-black text-xl">ClipForge AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'create' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
            ⚡ Create
          </button>
          <button onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
            📁 My Shorts
          </button>
        </div>
        <div className="flex items-center gap-3">
          {done && (
            <button onClick={() => setAgentOpen(!agentOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${agentOpen ? 'bg-[#7b2fff] border-[#7b2fff] text-white' : 'border-[#7b2fff]/50 text-[#7b2fff] hover:bg-[#7b2fff]/10'}`}>
              🤖 AI Agent
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-[#00c8ff]/10 border border-[#00c8ff]/20 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse" />
            <span className="text-xs text-[#00c8ff] font-semibold">3 free Shorts left</span>
          </div>
          <Link href="/settings" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black hover:opacity-80 transition-all">A</Link>
        </div>
      </nav>

      <div className="flex flex-1 relative">

        {/* MAIN CONTENT */}
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 overflow-x-hidden">

          {activeTab === 'create' && (
            <>
              {/* INPUT STATE */}
              {!isGenerating && !done && (
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-3">What's your Short about?</h1>
                    <p className="text-gray-400 text-lg">Type your idea — ClipForge handles the rest.</p>
                  </div>
                  <textarea value={idea} onChange={e => setIdea(e.target.value.slice(0, 200))}
                    placeholder="e.g. Why Nikola Tesla was the most misunderstood genius in history..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 text-lg resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors mb-4" />
                  <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">Choose Style</p>
                    <div className="grid grid-cols-5 gap-3">
                      {styles.map(s => (
                        <button key={s.id} onClick={() => setStyle(s.id)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${style === s.id ? 'bg-[#00c8ff]/10 border-[#00c8ff] text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                          <span className="text-2xl">{s.emoji}</span>
                          <span className="text-xs font-semibold">{s.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleGenerate} disabled={!idea.trim()}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black text-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    ⚡ Generate My Short
                  </button>
                  <p className="text-center text-gray-600 text-sm mt-4">Takes about 10 seconds · No editing required</p>
                </div>
              )}

              {/* PIPELINE */}
              {isGenerating && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">⚡</div>
                    <h2 className="text-3xl font-black mb-2">Creating your Short...</h2>
                    <p className="text-gray-400">"{idea.slice(0, 50)}{idea.length > 50 ? '...' : ''}"</p>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 mb-8">
                    <div className="h-1 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] transition-all duration-500"
                      style={{ width: `${(currentStep / pipeline.length) * 100}%` }} />
                  </div>
                  <div className="space-y-3">
                    {pipeline.map(step => {
                      const status = currentStep > step.id ? 'done' : currentStep === step.id ? 'active' : 'waiting'
                      return (
                        <div key={step.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${status === 'done' ? 'border-green-500/30 bg-green-500/5' : status === 'active' ? 'border-[#00c8ff]/50 bg-[#00c8ff]/5' : 'border-white/5 bg-white/[0.02]'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border ${status === 'done' ? 'border-green-500 bg-green-500/20' : status === 'active' ? 'border-[#00c8ff] bg-[#00c8ff]/20 animate-pulse' : 'border-white/10'}`}>
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

              {/* EDITOR */}
              {done && (
                <div className="max-w-6xl mx-auto w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-black">Video Editor</h2>
                      <p className="text-gray-400 text-sm mt-1">"{idea.slice(0, 50)}{idea.length > 50 ? '...' : ''}"</p>
                    </div>
                    <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-full transition-all">
                      + New Short
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* VIDEO PREVIEW */}
                    <div className="col-span-1 lg:col-span-1">
                      <div className="sticky top-24">
                        {/* Phone frame */}
                        <div className="relative mx-auto" style={{ width: '180px' }}>
                          <div className="bg-gray-900 rounded-[2rem] border-4 border-gray-700 overflow-hidden shadow-2xl" style={{ aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9' }}>
                            <div className="w-full h-full bg-gradient-to-b from-[#0a1628] to-[#050d1a] flex flex-col items-center justify-center relative">
                              {/* Fake video content */}
                              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/30" />
                              <div className="relative z-10 text-center p-4">
                                <div className="text-4xl mb-3">🌙</div>
                                <div className="text-xs font-bold text-white leading-tight">{idea.slice(0, 40)}</div>
                              </div>
                              {/* Caption bar */}
                              <div className="absolute bottom-8 left-2 right-2 text-center">
                                <span className={`font-black px-2 py-1 rounded text-xs ${captionSize === 'large' ? 'text-base' : captionSize === 'medium' ? 'text-sm' : 'text-xs'}`}
                                  style={{ color: captionColor, textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                                  The REAL reason...
                                </span>
                              </div>
                              {/* Play overlay */}
                              <button onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-all">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                                  {isPlaying ? '⏸' : '▶️'}
                                </div>
                              </button>
                            </div>
                          </div>
                          {/* Phone notch */}
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-700 rounded-full" />
                        </div>

                        {/* Playback controls */}
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0:00</span>
                            <span>0:58</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="h-1.5 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] rounded-full w-1/3" />
                          </div>
                          <div className="flex items-center justify-between">
                            <button className="text-gray-400 hover:text-white text-lg">⏮</button>
                            <button onClick={() => setIsPlaying(!isPlaying)}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-black font-bold">
                              {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button className="text-gray-400 hover:text-white text-lg">⏭</button>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">🔊</span>
                            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
                              className="flex-1 accent-[#00c8ff]" />
                            <span className="text-gray-400 w-6">{volume}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">⚡</span>
                            <select value={speed} onChange={e => setSpeed(+e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs">
                              <option value={0.5}>0.5x</option>
                              <option value={0.75}>0.75x</option>
                              <option value={1}>1x</option>
                              <option value={1.25}>1.25x</option>
                              <option value={1.5}>1.5x</option>
                              <option value={2}>2x</option>
                            </select>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                            <div className="text-2xl font-black text-[#00c8ff]">88</div>
                            <div className="text-xs text-gray-400">Viral Score</div>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                            <div className="text-lg font-black text-green-400">58s</div>
                            <div className="text-xs text-gray-400">Runtime</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EDITOR PANELS */}
                    <div className="col-span-1 lg:col-span-2">
                      {/* Editor tabs */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { id: 'video', label: '🎬 Video' },
                          { id: 'captions', label: '💬 Captions' },
                          { id: 'voice', label: '🎙️ Voice' },
                          { id: 'thumbnail', label: '🖼️ Thumbnail' },
                          { id: 'export', label: '🚀 Export' },
                        ].map(tab => (
                          <button key={tab.id} onClick={() => setActiveEditorTab(tab.id as any)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeEditorTab === tab.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* VIDEO TAB */}
                      {activeEditorTab === 'video' && (
                        <div className="space-y-4">
                          {/* Script editor */}
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-bold">✍️ Script Editor</h3>
                              <span className="text-xs text-gray-400">Click to edit</span>
                            </div>
                            <textarea value={script} onChange={e => setScript(e.target.value)} rows={10}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors leading-relaxed" />
                          </div>

                          {/* Trim */}
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">✂️ Trim Video</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                  <span>Start: {trimStart}%</span>
                                  <span>End: {trimEnd}%</span>
                                </div>
                                <div className="relative h-8 bg-white/10 rounded-lg overflow-hidden">
                                  <div className="absolute inset-y-0 bg-gradient-to-r from-[#00c8ff]/30 to-[#7b2fff]/30 rounded-lg"
                                    style={{ left: `${trimStart}%`, right: `${100 - trimEnd}%` }} />
                                  <input type="range" min="0" max="100" value={trimStart}
                                    onChange={e => setTrimStart(Math.min(+e.target.value, trimEnd - 5))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <input type="range" min="0" max="100" value={trimStart}
                                  onChange={e => setTrimStart(Math.min(+e.target.value, trimEnd - 5))}
                                  className="flex-1 accent-[#00c8ff]" />
                                <span className="text-xs text-gray-400 w-16 text-center">{Math.round(trimStart * 0.58)}s start</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <input type="range" min="0" max="100" value={trimEnd}
                                  onChange={e => setTrimEnd(Math.max(+e.target.value, trimStart + 5))}
                                  className="flex-1 accent-[#7b2fff]" />
                                <span className="text-xs text-gray-400 w-16 text-center">{Math.round(trimEnd * 0.58)}s end</span>
                              </div>
                            </div>
                          </div>

                          {/* Aspect ratio */}
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">📐 Screen Size</h3>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { ratio: '9:16', label: 'Shorts / TikTok', icon: '📱' },
                                { ratio: '1:1', label: 'Instagram Square', icon: '⬜' },
                                { ratio: '16:9', label: 'YouTube Wide', icon: '🖥️' },
                              ].map(r => (
                                <button key={r.ratio} onClick={() => setAspectRatio(r.ratio)}
                                  className={`p-3 rounded-xl border text-center transition-all ${aspectRatio === r.ratio ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 hover:border-white/20'}`}>
                                  <div className="text-2xl mb-1">{r.icon}</div>
                                  <div className="text-xs font-bold">{r.ratio}</div>
                                  <div className="text-[10px] text-gray-400">{r.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CAPTIONS TAB */}
                      {activeEditorTab === 'captions' && (
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">💬 Caption Style</h3>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {['word-by-word', 'full-line', 'none'].map(s => (
                                <button key={s} onClick={() => setCaptionStyle(s)}
                                  className={`p-3 rounded-xl border text-center transition-all ${captionStyle === s ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 hover:border-white/20'}`}>
                                  <div className="text-xs font-bold capitalize">{s.replace('-', ' ')}</div>
                                </button>
                              ))}
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="text-sm text-gray-400 block mb-2">Caption Color</label>
                                <div className="flex items-center gap-3">
                                  <input type="color" value={captionColor} onChange={e => setCaptionColor(e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                                  <div className="flex gap-2">
                                    {['#ffffff', '#ffff00', '#00c8ff', '#ff6b35', '#7b2fff'].map(c => (
                                      <button key={c} onClick={() => setCaptionColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${captionColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ background: c }} />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm text-gray-400 block mb-2">Caption Size</label>
                                <div className="flex gap-3">
                                  {['small', 'medium', 'large'].map(s => (
                                    <button key={s} onClick={() => setCaptionSize(s)}
                                      className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all capitalize ${captionSize === s ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-white' : 'border-white/10 text-gray-400'}`}>
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VOICE TAB */}
                      {activeEditorTab === 'voice' && (
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">🎙️ Voice Selection</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              {voices.map(v => (
                                <button key={v} onClick={() => setSelectedVoice(v)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedVoice === v ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 hover:border-white/20'}`}>
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">🎙️</div>
                                  <span className="text-sm font-semibold">{v}</span>
                                  {selectedVoice === v && <span className="ml-auto text-[#00c8ff] text-xs">✓</span>}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <label className="text-gray-400">Pitch</label>
                                  <span className="text-white">{voicePitch}%</span>
                                </div>
                                <input type="range" min="0" max="100" value={voicePitch}
                                  onChange={e => setVoicePitch(+e.target.value)}
                                  className="w-full accent-[#00c8ff]" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <label className="text-gray-400">Speed</label>
                                  <span className="text-white">{voiceSpeed}%</span>
                                </div>
                                <input type="range" min="0" max="100" value={voiceSpeed}
                                  onChange={e => setVoiceSpeed(+e.target.value)}
                                  className="w-full accent-[#7b2fff]" />
                              </div>
                            </div>

                            <div className="mt-4 bg-gradient-to-r from-[#7b2fff]/20 to-[#00c8ff]/20 border border-[#7b2fff]/30 rounded-xl p-4 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-sm">🎤 Clone Your Voice</div>
                                <div className="text-xs text-gray-400">Upload a sample to sound like you</div>
                              </div>
                              <button className="bg-[#7b2fff] text-white text-xs font-bold px-4 py-2 rounded-lg">Pro Only</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* THUMBNAIL TAB */}
                      {activeEditorTab === 'thumbnail' && (
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">🖼️ Thumbnail Creator</h3>

                            {/* Thumb preview */}
                            <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${thumbnailTemplates.find(t => t.id === selectedThumb)?.bg} flex items-center justify-center mb-4 relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-black/30" />
                              <div className="relative z-10 text-center px-6">
                                <div className="text-white font-black text-xl leading-tight">{thumbTitle}</div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="text-sm text-gray-400 block mb-2">Thumbnail Title</label>
                              <input value={thumbTitle} onChange={e => setThumbTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                            </div>

                            <div className="mb-4">
                              <label className="text-sm text-gray-400 block mb-3">Templates</label>
                              <div className="grid grid-cols-3 gap-3">
                                {thumbnailTemplates.map(t => (
                                  <button key={t.id} onClick={() => setSelectedThumb(t.id)}
                                    className={`aspect-video rounded-xl bg-gradient-to-br ${t.bg} border-2 transition-all ${selectedThumb === t.id ? 'border-white scale-105' : 'border-transparent hover:border-white/30'}`}>
                                    <span className="sr-only">{t.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button onClick={() => fileInputRef.current?.click()}
                                className="flex-1 border border-white/20 hover:border-white/40 py-3 rounded-xl text-sm font-semibold transition-all">
                                📁 Upload Image
                              </button>
                              <button className="flex-1 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold py-3 rounded-xl text-sm transition-all hover:opacity-90">
                                ⬇️ Download
                              </button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                          </div>
                        </div>
                      )}

                      {/* EXPORT TAB */}
                      {activeEditorTab === 'export' && (
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <h3 className="font-bold mb-4">⬇️ Download</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {[
                                { label: '1080p MP4', desc: 'Best quality', badge: 'PRO', color: '#7b2fff' },
                                { label: '720p MP4', desc: 'Standard quality', badge: 'FREE', color: '#00c8ff' },
                                { label: 'Script TXT', desc: 'Text only', badge: 'FREE', color: '#00c8ff' },
                                { label: 'Thumbnail PNG', desc: 'Cover image', badge: 'FREE', color: '#00c8ff' },
                              ].map(opt => (
                                <button key={opt.label} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-all text-left">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{opt.label}</div>
                                    <div className="text-xs text-gray-400">{opt.desc}</div>
                                  </div>
                                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${opt.color}20`, color: opt.color }}>{opt.badge}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* YouTube upload */}
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold">📺 YouTube Upload</h3>
                              <button onClick={() => setUploadToYT(!uploadToYT)}
                                className={`w-12 h-6 rounded-full transition-all relative ${uploadToYT ? 'bg-red-500' : 'bg-white/20'}`}>
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${uploadToYT ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>

                            {uploadToYT && (
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm text-gray-400 block mb-2">Video Title</label>
                                  <input value={ytTitle} onChange={e => setYtTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 block mb-2">Description</label>
                                  <textarea value={ytDesc} onChange={e => setYtDesc(e.target.value)} rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400 block mb-2">Visibility</label>
                                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
                                    <option value="public">Public</option>
                                    <option value="unlisted">Unlisted</option>
                                    <option value="private">Private</option>
                                    <option value="scheduled">Scheduled</option>
                                  </select>
                                </div>
                                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all">
                                  📺 Upload to YouTube
                                </button>
                              </div>
                            )}

                            {!uploadToYT && (
                              <p className="text-sm text-gray-400">Toggle on to publish directly to your YouTube channel after download.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="max-w-3xl mx-auto">
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
                    <div className="w-12 h-20 rounded-lg bg-gradient-to-b from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center shrink-0 text-xl">🎬</div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{s.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{s.style}</span>
                        <span>Viral Score: <span className="text-[#00c8ff] font-bold">{s.score}</span></span>
                        <span>{s.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{s.status}</span>
                      <button className="text-gray-400 hover:text-white text-xs border border-white/10 rounded-full px-3 py-1 transition-all">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* AI AGENT PANEL */}
        {agentOpen && done && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-[#080f1e] border-l border-white/10 flex flex-col z-30">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-sm">🤖</div>
                <div>
                  <div className="font-bold text-sm">ClipForge Agent</div>
                  <div className="text-xs text-green-400">● Online</div>
                </div>
              </div>
              <button onClick={() => setAgentOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {agentMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#00c8ff] text-black font-semibold' : 'bg-white/10 text-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {agentTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-4 py-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {agentSuggestions.slice(0, 3).map(s => (
                  <button key={s} onClick={() => handleAgentSend(s)}
                    className="text-xs bg-white/5 border border-white/10 hover:border-white/30 rounded-full px-3 py-1 transition-all text-gray-300">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input value={agentInput} onChange={e => setAgentInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAgentSend()}
                  placeholder="Ask the AI agent..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7b2fff]/50 transition-colors" />
                <button onClick={() => handleAgentSend()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-white font-bold hover:opacity-90 transition-all">
                  ↑
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}