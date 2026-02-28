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
  { id: 1, icon: '✍️', label: 'Writing Script' },
  { id: 2, icon: '🎙️', label: 'Generating Voice' },
  { id: 3, icon: '🎬', label: 'Creating Visuals' },
  { id: 4, icon: '💬', label: 'Adding Captions' },
  { id: 5, icon: '🎵', label: 'Scoring Music' },
  { id: 6, icon: '🚀', label: 'Final Assembly' },
]

const voices = ['Nova ♀', 'Echo ♂', 'Aria ♀', 'Orion ♂', 'Sage ♀', 'Atlas ♂']

const thumbnailTemplates = [
  { id: 1, bg: 'from-red-600 to-orange-500' },
  { id: 2, bg: 'from-blue-600 to-cyan-400' },
  { id: 3, bg: 'from-purple-600 to-pink-500' },
  { id: 4, bg: 'from-green-600 to-emerald-400' },
  { id: 5, bg: 'from-yellow-500 to-orange-400' },
  { id: 6, bg: 'from-gray-800 to-gray-600' },
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
Then suddenly — all three missions were cancelled.

The documents exist. The whistleblowers have spoken.
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
  const [thumbImageUrl, setThumbImageUrl] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [uploadToYT, setUploadToYT] = useState(false)
  const [ytTitle, setYtTitle] = useState('')
  const [ytDesc, setYtDesc] = useState('')
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
    setThumbImageUrl(null)
  }

  function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setThumbImageUrl(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white flex flex-col">

      {/* NAV */}
      <nav className="border-b border-white/10 px-4 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40 bg-[#050d1a]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black">C</div>
          <span className="font-black text-lg">ClipForge AI</span>
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'create' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
            ⚡ Create
          </button>
          <button onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
            📁 Shorts
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#00c8ff]/10 border border-[#00c8ff]/20 rounded-full px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-pulse" />
            <span className="text-xs text-[#00c8ff] font-semibold">3 left</span>
          </div>
          <Link href="/settings" className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black">A</Link>
        </div>
      </nav>

      <div className="flex-1 px-4 py-6 overflow-x-hidden">

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <>
            {/* INPUT */}
            {!isGenerating && !done && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-4xl font-black mb-2">What's your Short about?</h1>
                  <p className="text-gray-400 text-sm sm:text-base">Type your idea — ClipForge handles the rest.</p>
                </div>
                <textarea value={idea} onChange={e => setIdea(e.target.value.slice(0, 200))}
                  placeholder="e.g. Why Nikola Tesla was the most misunderstood genius in history..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm sm:text-base resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors mb-4" />
                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Choose Style</p>
                  <div className="grid grid-cols-5 gap-2">
                    {styles.map(s => (
                      <button key={s.id} onClick={() => setStyle(s.id)}
                        className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border text-center transition-all ${style === s.id ? 'bg-[#00c8ff]/10 border-[#00c8ff] text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <span className="text-lg sm:text-2xl">{s.emoji}</span>
                        <span className="text-[10px] sm:text-xs font-semibold">{s.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={!idea.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black text-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  ⚡ Generate My Short
                </button>
              </div>
            )}

            {/* PIPELINE */}
            {isGenerating && (
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3 animate-pulse">⚡</div>
                  <h2 className="text-2xl font-black mb-1">Creating your Short...</h2>
                  <p className="text-gray-400 text-sm">"{idea.slice(0, 40)}{idea.length > 40 ? '...' : ''}"</p>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mb-6">
                  <div className="h-1 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] transition-all duration-500"
                    style={{ width: `${(currentStep / pipeline.length) * 100}%` }} />
                </div>
                <div className="space-y-2">
                  {pipeline.map(step => {
                    const status = currentStep > step.id ? 'done' : currentStep === step.id ? 'active' : 'waiting'
                    return (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${status === 'done' ? 'border-green-500/30 bg-green-500/5' : status === 'active' ? 'border-[#00c8ff]/50 bg-[#00c8ff]/5' : 'border-white/5'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 border ${status === 'done' ? 'border-green-500 bg-green-500/20' : status === 'active' ? 'border-[#00c8ff] bg-[#00c8ff]/20 animate-pulse' : 'border-white/10'}`}>
                          {status === 'done' ? '✓' : step.icon}
                        </div>
                        <span className={`font-semibold text-sm ${status === 'done' ? 'text-green-400' : status === 'active' ? 'text-[#00c8ff]' : 'text-gray-500'}`}>{step.label}</span>
                        {status === 'active' && <span className="ml-auto text-xs text-[#00c8ff] animate-pulse">Processing...</span>}
                        {status === 'done' && <span className="ml-auto text-xs text-green-400">✓</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* EDITOR */}
            {done && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Video Editor</h2>
                    <p className="text-gray-400 text-xs mt-0.5">"{idea.slice(0, 35)}{idea.length > 35 ? '...' : ''}"</p>
                  </div>
                  <button onClick={handleReset} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-all">
                    + New
                  </button>
                </div>

                {/* Mobile: stacked, Desktop: side by side */}
                <div className="flex flex-col xl:flex-row gap-4">

                  {/* VIDEO PREVIEW */}
                  <div className="xl:w-56 shrink-0">
                    <div className="flex xl:flex-col gap-4">
                      {/* Phone */}
                      <div className="relative mx-auto" style={{ width: '140px', minWidth: '140px' }}>
                        <div className="bg-gray-900 rounded-[1.5rem] border-4 border-gray-700 overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16' }}>
                          <div className="w-full h-full bg-gradient-to-b from-[#0a1628] to-[#050d1a] flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/30" />
                            <div className="relative z-10 text-center p-2">
                              <div className="text-3xl mb-2">🌙</div>
                              <div className="text-[10px] font-bold text-white leading-tight">{idea.slice(0, 30)}</div>
                            </div>
                            <div className="absolute bottom-4 left-1 right-1 text-center">
                              <span className="font-black text-xs" style={{ color: captionColor }}>The REAL reason...</span>
                            </div>
                            <button onClick={() => setIsPlaying(!isPlaying)}
                              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-all">
                              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                {isPlaying ? '⏸' : '▶️'}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex xl:flex-col gap-2 flex-1 xl:flex-none">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                          <div className="text-xl font-black text-[#00c8ff]">88</div>
                          <div className="text-[10px] text-gray-400">Viral Score</div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                          <div className="text-base font-black text-green-400">58s</div>
                          <div className="text-[10px] text-gray-400">Runtime</div>
                        </div>
                        {/* Playback */}
                        <div className="flex-1 xl:flex-none bg-white/5 border border-white/10 rounded-xl p-2">
                          <div className="flex items-center gap-1 justify-center mb-1">
                            <button onClick={() => setIsPlaying(!isPlaying)}
                              className="w-7 h-7 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-black font-bold text-xs">
                              {isPlaying ? '⏸' : '▶'}
                            </button>
                          </div>
                          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
                            className="w-full accent-[#00c8ff]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EDITOR PANELS */}
                  <div className="flex-1 min-w-0">
                    {/* Tabs - scrollable */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                      {[
                        { id: 'video', label: '🎬 Video' },
                        { id: 'captions', label: '💬 Captions' },
                        { id: 'voice', label: '🎙️ Voice' },
                        { id: 'thumbnail', label: '🖼️ Thumbnail' },
                        { id: 'export', label: '🚀 Export' },
                      ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveEditorTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${activeEditorTab === tab.id ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-400'}`}>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* VIDEO TAB */}
                    {activeEditorTab === 'video' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">✍️ Script Editor</h3>
                          <textarea value={script} onChange={e => setScript(e.target.value)} rows={8}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors leading-relaxed" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">✂️ Trim Video</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Start: {Math.round(trimStart * 0.58)}s</span>
                              <span>End: {Math.round(trimEnd * 0.58)}s</span>
                            </div>
                            <input type="range" min="0" max="100" value={trimStart}
                              onChange={e => setTrimStart(Math.min(+e.target.value, trimEnd - 5))}
                              className="w-full accent-[#00c8ff]" />
                            <input type="range" min="0" max="100" value={trimEnd}
                              onChange={e => setTrimEnd(Math.max(+e.target.value, trimStart + 5))}
                              className="w-full accent-[#7b2fff]" />
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">📐 Screen Size</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { ratio: '9:16', label: 'Shorts', icon: '📱' },
                              { ratio: '1:1', label: 'Square', icon: '⬜' },
                              { ratio: '16:9', label: 'Wide', icon: '🖥️' },
                            ].map(r => (
                              <button key={r.ratio} onClick={() => setAspectRatio(r.ratio)}
                                className={`p-2 rounded-xl border text-center transition-all ${aspectRatio === r.ratio ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10'}`}>
                                <div className="text-lg">{r.icon}</div>
                                <div className="text-xs font-bold">{r.ratio}</div>
                                <div className="text-[10px] text-gray-400">{r.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">⚡ Playback Speed</h3>
                          <div className="flex gap-2 flex-wrap">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                              <button key={s} onClick={() => setSpeed(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${speed === s ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-400'}`}>
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CAPTIONS TAB */}
                    {activeEditorTab === 'captions' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-4">💬 Caption Style</h3>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {['word-by-word', 'full-line', 'none'].map(s => (
                              <button key={s} onClick={() => setCaptionStyle(s)}
                                className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${captionStyle === s ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10'}`}>
                                {s.replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                          <div className="mb-4">
                            <label className="text-xs text-gray-400 block mb-2">Caption Color</label>
                            <div className="flex items-center gap-2 flex-wrap">
                              <input type="color" value={captionColor} onChange={e => setCaptionColor(e.target.value)}
                                className="w-9 h-9 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                              {['#ffffff', '#ffff00', '#00c8ff', '#ff6b35', '#7b2fff'].map(c => (
                                <button key={c} onClick={() => setCaptionColor(c)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${captionColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                  style={{ background: c }} />
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-2">Caption Size</label>
                            <div className="flex gap-2">
                              {['small', 'medium', 'large'].map(s => (
                                <button key={s} onClick={() => setCaptionSize(s)}
                                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${captionSize === s ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-white' : 'border-white/10 text-gray-400'}`}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VOICE TAB */}
                    {activeEditorTab === 'voice' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-4">🎙️ Voice Selection</h3>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {voices.map(v => (
                              <button key={v} onClick={() => setSelectedVoice(v)}
                                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${selectedVoice === v ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10'}`}>
                                <span className="text-lg">🎙️</span>
                                <span className="text-xs font-semibold">{v}</span>
                                {selectedVoice === v && <span className="ml-auto text-[#00c8ff] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Pitch</span>
                                <span>{voicePitch}%</span>
                              </div>
                              <input type="range" min="0" max="100" value={voicePitch}
                                onChange={e => setVoicePitch(+e.target.value)}
                                className="w-full accent-[#00c8ff]" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Speed</span>
                                <span>{voiceSpeed}%</span>
                              </div>
                              <input type="range" min="0" max="100" value={voiceSpeed}
                                onChange={e => setVoiceSpeed(+e.target.value)}
                                className="w-full accent-[#7b2fff]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* THUMBNAIL TAB */}
                    {activeEditorTab === 'thumbnail' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">🖼️ Thumbnail Creator</h3>

                          {/* Preview */}
                          <div className={`w-full aspect-video rounded-xl flex items-center justify-center mb-4 relative overflow-hidden ${!thumbImageUrl ? `bg-gradient-to-br ${thumbnailTemplates.find(t => t.id === selectedThumb)?.bg}` : ''}`}>
                            {thumbImageUrl ? (
                              <img src={thumbImageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="relative z-10 text-center px-4">
                                  <div className="text-white font-black text-sm sm:text-lg leading-tight">{thumbTitle}</div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="text-xs text-gray-400 block mb-1">Thumbnail Title</label>
                            <input value={thumbTitle} onChange={e => setThumbTitle(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                          </div>

                          <div className="mb-4">
                            <label className="text-xs text-gray-400 block mb-2">Templates</label>
                            <div className="grid grid-cols-3 gap-2">
                              {thumbnailTemplates.map(t => (
                                <button key={t.id} onClick={() => { setSelectedThumb(t.id); setThumbImageUrl(null) }}
                                  className={`aspect-video rounded-xl bg-gradient-to-br ${t.bg} border-2 transition-all ${selectedThumb === t.id && !thumbImageUrl ? 'border-white scale-105' : 'border-transparent'}`} />
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1 border border-white/20 hover:border-[#00c8ff]/50 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-[#00c8ff]/5">
                              📁 Upload Image
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold py-2.5 rounded-xl text-xs transition-all hover:opacity-90">
                              ⬇️ Download
                            </button>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbUpload}
                            className="hidden" />
                          {thumbImageUrl && (
                            <button onClick={() => setThumbImageUrl(null)}
                              className="w-full mt-2 text-xs text-gray-400 hover:text-white border border-white/10 rounded-xl py-2 transition-all">
                              ✕ Remove uploaded image
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* EXPORT TAB */}
                    {activeEditorTab === 'export' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">⬇️ Download</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: '1080p MP4', badge: 'PRO', color: '#7b2fff' },
                              { label: '720p MP4', badge: 'FREE', color: '#00c8ff' },
                              { label: 'Script TXT', badge: 'FREE', color: '#00c8ff' },
                              { label: 'Thumbnail PNG', badge: 'FREE', color: '#00c8ff' },
                            ].map(opt => (
                              <button key={opt.label} className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-all text-left">
                                <div className="flex-1">
                                  <div className="font-semibold text-xs">{opt.label}</div>
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${opt.color}20`, color: opt.color }}>{opt.badge}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm">📺 YouTube Upload</h3>
                            <button onClick={() => setUploadToYT(!uploadToYT)}
                              className={`w-10 h-5 rounded-full transition-all relative ${uploadToYT ? 'bg-red-500' : 'bg-white/20'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${uploadToYT ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>
                          {uploadToYT && (
                            <div className="space-y-3">
                              <input value={ytTitle} onChange={e => setYtTitle(e.target.value)}
                                placeholder="Video title"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                              <textarea value={ytDesc} onChange={e => setYtDesc(e.target.value)} rows={2}
                                placeholder="Description"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm">
                                📺 Upload to YouTube
                              </button>
                            </div>
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
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">My Shorts</h2>
              <button onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold px-4 py-2 rounded-full text-xs hover:opacity-90 transition-all">
                + New Short
              </button>
            </div>
            <div className="space-y-3">
              {recentShorts.map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:border-white/20 transition-all">
                  <div className="w-10 h-16 rounded-lg bg-gradient-to-b from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center shrink-0 text-lg">🎬</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{s.title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                      <span className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{s.style}</span>
                      <span>Score: <span className="text-[#00c8ff] font-bold">{s.score}</span></span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${s.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-[#00c8ff]">3</div>
                <div className="text-xs text-gray-400 mt-1">Total</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-green-400">2</div>
                <div className="text-xs text-gray-400 mt-1">Published</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-[#7b2fff]">91</div>
                <div className="text-xs text-gray-400 mt-1">Avg Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}