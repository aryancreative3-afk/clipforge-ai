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

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
]

const accents = [
  { id: 'american', label: 'American', flag: '🇺🇸' },
  { id: 'british', label: 'British', flag: '🇬🇧' },
  { id: 'indian', label: 'Indian', flag: '🇮🇳' },
  { id: 'australian', label: 'Australian', flag: '🇦🇺' },
  { id: 'canadian', label: 'Canadian', flag: '🇨🇦' },
  { id: 'irish', label: 'Irish', flag: '🇮🇪' },
]

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
  const [activeEditorTab, setActiveEditorTab] = useState<'export' | 'video' | 'captions' | 'voice' | 'language' | 'media' | 'brand' | 'thumbnail'>('export')
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
  const [ytHashtags, setYtHashtags] = useState('#shorts #viral #youtube')
  const [ytTags, setYtTags] = useState('shorts, viral, youtube, trending')
  const [ytVisibility, setYtVisibility] = useState<'public' | 'unlisted' | 'private'>('public')
  const [ytCategory, setYtCategory] = useState('Education')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedAccent, setSelectedAccent] = useState('american')
  const [brandLogo, setBrandLogo] = useState('')
  const [brandColor, setBrandColor] = useState('#00c8ff')
  const [brandFont, setBrandFont] = useState('Inter')
  const [pexelsQuery, setPexelsQuery] = useState('')
  const [pexelsResults, setPexelsResults] = useState<any[]>([])
  const [pexelsLoading, setPexelsLoading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [magicCommand, setMagicCommand] = useState('')
  const [magicOpen, setMagicOpen] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicResult, setMagicResult] = useState('')
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
    setYtHashtags(`#shorts #${style.toLowerCase()} #viral #youtube #trending`)
    setYtTags(`shorts, ${style.toLowerCase()}, viral, youtube, trending, ${idea.split(' ').slice(0, 3).join(', ')}`)
    setIsGenerating(false)
    setDone(true)
    setActiveEditorTab('export')
  }

  function handleReset() {
    setIdea('')
    setCurrentStep(0)
    setDone(false)
    setIsGenerating(false)
    setThumbImageUrl(null)
    setSelectedMedia(null)
    setMagicResult('')
  }

  function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setThumbImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function searchPexels(query: string) {
    if (!query.trim()) return
    setPexelsLoading(true)
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=portrait`,
        { headers: { Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || '' } }
      )
      const data = await res.json()
      setPexelsResults(data.photos || [])
    } catch {
      console.error('Pexels search failed')
    }
    setPexelsLoading(false)
  }

  async function handleMagicCommand() {
    if (!magicCommand.trim()) return
    setMagicLoading(true)
    setMagicResult('')
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: magicCommand }],
          script, idea, style
        })
      })
      const data = await res.json()
      if (data.reply) {
        setMagicResult(data.reply)
        // Auto-apply script changes
        if (magicCommand.toLowerCase().includes('rewrite') ||
            magicCommand.toLowerCase().includes('shorter') ||
            magicCommand.toLowerCase().includes('hook')) {
          setScript(data.reply)
          setActiveEditorTab('video')
        }
      }
    } catch {
      setMagicResult('⚠️ Magic Box unavailable. Try again!')
    }
    setMagicLoading(false)
  }

  const editorTabs = [
    { id: 'export', label: '🚀 Export' },
    { id: 'video', label: '🎬 Video' },
    { id: 'captions', label: '💬 Captions' },
    { id: 'voice', label: '🎙️ Voice' },
    { id: 'language', label: '🌍 Language' },
    { id: 'media', label: '📸 Media' },
    { id: 'brand', label: '🎨 Brand' },
    { id: 'thumbnail', label: '🖼️ Thumb' },
  ]

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
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Video Editor</h2>
                    <p className="text-gray-400 text-xs mt-0.5">"{idea.slice(0, 35)}{idea.length > 35 ? '...' : ''}"</p>
                  </div>
                  <button onClick={handleReset} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-all">
                    + New
                  </button>
                </div>

                <div className="flex flex-col xl:flex-row gap-4">

                  {/* VIDEO PREVIEW */}
                  <div className="xl:w-52 shrink-0">
                    <div className="flex xl:flex-col gap-3">
                      <div className="relative mx-auto" style={{ width: '130px', minWidth: '130px' }}>
                        <div className="bg-gray-900 rounded-[1.5rem] border-4 border-gray-700 overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16' }}>
                          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                            style={{ background: selectedMedia ? `url(${selectedMedia}) center/cover` : 'linear-gradient(to bottom, #0a1628, #050d1a)' }}>
                            {!selectedMedia && <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/30" />}
                            <div className="relative z-10 text-center p-2">
                              <div className="text-3xl mb-2">🌙</div>
                              <div className="text-[10px] font-bold text-white leading-tight">{idea.slice(0, 30)}</div>
                            </div>
                            <div className="absolute bottom-4 left-1 right-1 text-center">
                              <span className="font-black text-xs" style={{ color: captionColor, fontFamily: brandFont }}>The REAL reason...</span>
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
                      <div className="flex xl:flex-col gap-2 flex-1 xl:flex-none">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                          <div className="text-xl font-black text-[#00c8ff]">88</div>
                          <div className="text-[10px] text-gray-400">Viral Score</div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                          <div className="text-base font-black text-green-400">58s</div>
                          <div className="text-[10px] text-gray-400">Runtime</div>
                        </div>
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

                    {/* Tabs — horizontal scroll with arrows hint */}
                    <div className="relative mb-4">
                      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {editorTabs.map(tab => (
                          <button key={tab.id} onClick={() => setActiveEditorTab(tab.id as any)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all whitespace-nowrap snap-start shrink-0 ${activeEditorTab === tab.id ? 'bg-gradient-to-r from-[#00c8ff]/20 to-[#7b2fff]/20 border-[#00c8ff]/50 text-white' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      {/* Fade hint on right */}
                      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#050d1a] to-transparent pointer-events-none" />
                    </div>

                    {/* EXPORT TAB — now first */}
                    {activeEditorTab === 'export' && (
                      <div className="space-y-3">
                        {/* Download */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">⬇️ Download Your Short</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: '1080p MP4', badge: 'PRO', color: '#7b2fff', icon: '🎬' },
                              { label: '720p MP4', badge: 'FREE', color: '#00c8ff', icon: '📹' },
                              { label: 'Script TXT', badge: 'FREE', color: '#00c8ff', icon: '📄' },
                              { label: 'Thumbnail PNG', badge: 'FREE', color: '#00c8ff', icon: '🖼️' },
                            ].map(opt => (
                              <button key={opt.label}
                                className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl transition-all text-left group">
                                <span className="text-lg">{opt.icon}</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-xs group-hover:text-white transition-colors">{opt.label}</div>
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                                  style={{ background: `${opt.color}20`, color: opt.color }}>{opt.badge}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* YouTube Upload */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📺</span>
                              <div>
                                <h3 className="font-bold text-sm">Upload to YouTube</h3>
                                <p className="text-xs text-gray-400">Fill in details before publishing</p>
                              </div>
                            </div>
                            <button onClick={() => setUploadToYT(!uploadToYT)}
                              className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${uploadToYT ? 'bg-red-500' : 'bg-white/20'}`}>
                              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${uploadToYT ? 'left-7' : 'left-1'}`} />
                            </button>
                          </div>

                          {uploadToYT && (
                            <div className="space-y-3">
                              {/* Title */}
                              <div>
                                <label className="text-xs text-gray-400 font-semibold block mb-1">📝 Video Title <span className="text-red-400">*</span></label>
                                <input value={ytTitle} onChange={e => setYtTitle(e.target.value.slice(0, 100))}
                                  placeholder="Enter your video title..."
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                <div className="text-right text-xs text-gray-600 mt-1">{ytTitle.length}/100</div>
                              </div>

                              {/* Description */}
                              <div>
                                <label className="text-xs text-gray-400 font-semibold block mb-1">📋 Description</label>
                                <textarea value={ytDesc} onChange={e => setYtDesc(e.target.value.slice(0, 5000))} rows={3}
                                  placeholder="Describe your video..."
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                <div className="text-right text-xs text-gray-600 mt-1">{ytDesc.length}/5000</div>
                              </div>

                              {/* Hashtags */}
                              <div>
                                <label className="text-xs text-gray-400 font-semibold block mb-1">🔖 Hashtags</label>
                                <input value={ytHashtags} onChange={e => setYtHashtags(e.target.value)}
                                  placeholder="#shorts #viral #youtube"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                <p className="text-xs text-gray-600 mt-1">Add hashtags separated by spaces</p>
                              </div>

                              {/* Tags */}
                              <div>
                                <label className="text-xs text-gray-400 font-semibold block mb-1">🏷️ Tags</label>
                                <input value={ytTags} onChange={e => setYtTags(e.target.value)}
                                  placeholder="shorts, viral, youtube, trending"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                                <p className="text-xs text-gray-600 mt-1">Separate tags with commas</p>
                              </div>

                              {/* Visibility + Category */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-400 font-semibold block mb-1">👁️ Visibility</label>
                                  <div className="flex flex-col gap-1.5">
                                    {(['public', 'unlisted', 'private'] as const).map(v => (
                                      <button key={v} onClick={() => setYtVisibility(v)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${ytVisibility === v ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-400'}`}>
                                        {v === 'public' ? '🌍' : v === 'unlisted' ? '🔗' : '🔒'} {v}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 font-semibold block mb-1">📂 Category</label>
                                  <div className="flex flex-col gap-1.5">
                                    {['Education', 'Entertainment', 'Science', 'People', 'News'].map(cat => (
                                      <button key={cat} onClick={() => setYtCategory(cat)}
                                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${ytCategory === cat ? 'border-[#7b2fff] bg-[#7b2fff]/10 text-[#7b2fff]' : 'border-white/10 text-gray-400'}`}>
                                        {cat}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Summary preview */}
                              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
                                <p className="text-xs text-gray-400 font-semibold mb-2">📋 Upload Summary</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Title:</span><span className="text-white truncate">{ytTitle || '—'}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Visibility:</span><span className="text-[#00c8ff] capitalize">{ytVisibility}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Category:</span><span className="text-white">{ytCategory}</span></div>
                                  <div className="flex gap-2"><span className="text-gray-500 w-20 shrink-0">Hashtags:</span><span className="text-[#7b2fff] truncate">{ytHashtags || '—'}</span></div>
                                </div>
                              </div>

                              <button disabled={!ytTitle.trim()}
                                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                                <span>📺</span> Upload to YouTube Now
                              </button>
                              <p className="text-center text-gray-600 text-xs">YouTube API integration coming soon</p>
                            </div>
                          )}

                          {!uploadToYT && (
                            <div className="text-center py-4">
                              <p className="text-gray-400 text-sm">Toggle on to configure YouTube upload</p>
                              <p className="text-gray-600 text-xs mt-1">Add title, description, hashtags, tags & more</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

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
                                <span className="text-gray-400">Pitch</span><span>{voicePitch}%</span>
                              </div>
                              <input type="range" min="0" max="100" value={voicePitch} onChange={e => setVoicePitch(+e.target.value)} className="w-full accent-[#00c8ff]" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Speed</span><span>{voiceSpeed}%</span>
                              </div>
                              <input type="range" min="0" max="100" value={voiceSpeed} onChange={e => setVoiceSpeed(+e.target.value)} className="w-full accent-[#7b2fff]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LANGUAGE TAB */}
                    {activeEditorTab === 'language' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-4">🌍 Output Language</h3>
                          <div className="grid grid-cols-2 gap-2 mb-6">
                            {languages.map(lang => (
                              <button key={lang.code} onClick={() => setSelectedLanguage(lang.code)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${selectedLanguage === lang.code ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 hover:border-white/20'}`}>
                                <span className="text-lg">{lang.flag}</span>
                                <span className="text-xs font-semibold">{lang.name}</span>
                                {selectedLanguage === lang.code && <span className="ml-auto text-[#00c8ff] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                          <h3 className="font-bold text-sm mb-3">🗣️ Voice Accent</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {accents.map(accent => (
                              <button key={accent.id} onClick={() => setSelectedAccent(accent.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${selectedAccent === accent.id ? 'border-[#7b2fff] bg-[#7b2fff]/10' : 'border-white/10 hover:border-white/20'}`}>
                                <span className="text-lg">{accent.flag}</span>
                                <span className="text-xs font-semibold">{accent.label}</span>
                                {selectedAccent === accent.id && <span className="ml-auto text-[#7b2fff] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-[#00c8ff]/5 border border-[#00c8ff]/20 rounded-xl">
                            <p className="text-xs text-[#00c8ff] font-semibold">
                              ✓ Script will be auto-translated to {languages.find(l => l.code === selectedLanguage)?.name} with {accents.find(a => a.id === selectedAccent)?.label} accent
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MEDIA TAB */}
                    {activeEditorTab === 'media' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">📸 Stock Media Library</h3>
                          <div className="flex gap-2 mb-4">
                            <input value={pexelsQuery} onChange={e => setPexelsQuery(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && searchPexels(pexelsQuery)}
                              placeholder="Search space, nature, city..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                            <button onClick={() => searchPexels(pexelsQuery)} disabled={pexelsLoading}
                              className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold px-4 rounded-xl text-xs hover:opacity-90 transition-all disabled:opacity-50">
                              {pexelsLoading ? '...' : '🔍'}
                            </button>
                          </div>
                          {pexelsResults.length === 0 && !pexelsLoading && (
                            <div className="text-center py-8">
                              <div className="text-4xl mb-2">📸</div>
                              <p className="text-gray-400 text-xs">Search for background clips</p>
                              <div className="flex flex-wrap gap-2 justify-center mt-3">
                                {['space', 'nature', 'city', 'ocean', 'forest', 'abstract'].map(q => (
                                  <button key={q} onClick={() => { setPexelsQuery(q); searchPexels(q) }}
                                    className="text-xs border border-white/10 rounded-full px-3 py-1 hover:border-[#00c8ff]/50 transition-all text-gray-400">
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {pexelsLoading && (
                            <div className="text-center py-8">
                              <div className="text-3xl animate-spin mb-2">⚡</div>
                              <p className="text-gray-400 text-xs">Searching Pexels...</p>
                            </div>
                          )}
                          {pexelsResults.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {pexelsResults.map(photo => (
                                <button key={photo.id} onClick={() => setSelectedMedia(photo.src.medium)}
                                  className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${selectedMedia === photo.src.medium ? 'border-[#00c8ff] scale-95' : 'border-transparent hover:border-white/30'}`}>
                                  <img src={photo.src.small} alt={photo.alt} className="w-full h-full object-cover" />
                                  {selectedMedia === photo.src.medium && (
                                    <div className="absolute inset-0 bg-[#00c8ff]/20 flex items-center justify-center">
                                      <span className="text-2xl">✓</span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                          {selectedMedia && (
                            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span className="text-xs text-green-400 font-semibold">Background media selected!</span>
                              <button onClick={() => setSelectedMedia(null)} className="ml-auto text-xs text-gray-400 hover:text-white">Remove</button>
                            </div>
                          )}
                          <p className="text-center text-gray-600 text-xs mt-3">Powered by Pexels · Free to use</p>
                        </div>
                      </div>
                    )}

                    {/* BRAND TAB */}
                    {activeEditorTab === 'brand' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-4">🎨 Brand Kit</h3>
                          <div className="mb-4">
                            <label className="text-xs text-gray-400 block mb-2 font-semibold">Brand Color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)}
                                className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent" />
                              <div className="flex-1">
                                <div className="font-bold text-sm">{brandColor}</div>
                                <div className="text-xs text-gray-400">Used in captions & thumbnails</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {['#00c8ff', '#7b2fff', '#ff6b35', '#ff3366', '#00ff88', '#ffcc00'].map(c => (
                                <button key={c} onClick={() => setBrandColor(c)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${brandColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                  style={{ background: c }} />
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="text-xs text-gray-400 block mb-2 font-semibold">Brand Font</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Oswald', 'Poppins'].map(font => (
                                <button key={font} onClick={() => setBrandFont(font)}
                                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${brandFont === font ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-300'}`}
                                  style={{ fontFamily: font }}>
                                  {font}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="text-xs text-gray-400 block mb-2 font-semibold">Brand Logo URL</label>
                            <input value={brandLogo} onChange={e => setBrandLogo(e.target.value)}
                              placeholder="https://your-logo-url.com/logo.png"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                            {brandLogo && (
                              <div className="mt-2 p-2 bg-white/5 rounded-xl flex items-center gap-2">
                                <img src={brandLogo} alt="Logo" className="w-8 h-8 object-contain rounded" onError={() => setBrandLogo('')} />
                                <span className="text-xs text-gray-400">Logo preview</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 rounded-2xl border border-white/10" style={{ background: `${brandColor}15` }}>
                            <div className="text-xs text-gray-400 mb-2 font-semibold">Preview</div>
                            <div className="aspect-video rounded-xl flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${brandColor}30, #050d1a)` }}>
                              <div className="text-center">
                                <div className="font-black text-lg mb-1" style={{ color: brandColor, fontFamily: brandFont }}>ClipForge AI</div>
                                <div className="text-xs text-gray-300" style={{ fontFamily: brandFont }}>Your Brand Style</div>
                              </div>
                            </div>
                          </div>
                          <button className="w-full mt-3 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black py-3 rounded-xl text-sm hover:opacity-90 transition-all">
                            ✓ Apply Brand Kit to All Shorts
                          </button>
                        </div>
                      </div>
                    )}

                    {/* THUMBNAIL TAB */}
                    {activeEditorTab === 'thumbnail' && (
                      <div className="space-y-3">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <h3 className="font-bold text-sm mb-3">🖼️ Thumbnail Creator</h3>
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
                            <button onClick={() => fileInputRef.current?.click()}
                              className="flex-1 border border-white/20 hover:border-[#00c8ff]/50 py-2.5 rounded-xl text-xs font-semibold transition-all">
                              📁 Upload Image
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold py-2.5 rounded-xl text-xs transition-all hover:opacity-90">
                              ⬇️ Download
                            </button>
                          </div>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
                          {thumbImageUrl && (
                            <button onClick={() => setThumbImageUrl(null)}
                              className="w-full mt-2 text-xs text-gray-400 hover:text-white border border-white/10 rounded-xl py-2 transition-all">
                              ✕ Remove image
                            </button>
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

      {/* MAGIC BOX */}
      {done && (
        <div className="fixed bottom-24 left-4 sm:left-6 z-40">
          {magicOpen && (
            <div className="mb-3 bg-[#080f1e] border border-[#7b2fff]/50 rounded-2xl p-4 shadow-2xl w-80"
              style={{ boxShadow: '0 0 40px rgba(123,47,255,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🪄</span>
                <span className="font-black text-sm">Magic Box</span>
                <button onClick={() => { setMagicOpen(false); setMagicResult('') }} className="ml-auto text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <p className="text-xs text-gray-400 mb-3">Type any instruction — AI will apply it to your Short instantly</p>
              <div className="flex gap-2 mb-3">
                <input value={magicCommand} onChange={e => setMagicCommand(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMagicCommand()}
                  placeholder='e.g. "make hook dramatic"'
                  autoFocus
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7b2fff]/50 transition-colors" />
                <button onClick={handleMagicCommand} disabled={magicLoading || !magicCommand.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-white text-sm disabled:opacity-40">
                  {magicLoading ? '...' : '→'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['Make hook dramatic', 'Shorter script', 'Add strong CTA', 'Cinematic style', 'Score my viral potential', 'Suggest better title'].map(cmd => (
                  <button key={cmd} onClick={() => setMagicCommand(cmd)}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 hover:border-[#7b2fff]/50 hover:text-white transition-all text-gray-400">
                    {cmd}
                  </button>
                ))}
              </div>
              {magicLoading && (
                <div className="flex items-center gap-2 text-xs text-[#7b2fff] py-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  AI is applying your command...
                </div>
              )}
              {magicResult && !magicLoading && (
                <div className="bg-[#7b2fff]/10 border border-[#7b2fff]/30 rounded-xl p-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs text-[#7b2fff] font-bold">✨ Magic Result</span>
                    <button onClick={() => setMagicResult('')} className="ml-auto text-gray-500 hover:text-white text-xs">✕</button>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{magicResult}</p>
                  <button onClick={() => { setScript(magicResult); setActiveEditorTab('video'); setMagicOpen(false); setMagicResult('') }}
                    className="w-full mt-2 bg-[#7b2fff] text-white font-bold text-xs py-2 rounded-lg hover:bg-[#6a1fe0] transition-all">
                    ✓ Apply to Script
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setMagicOpen(!magicOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-xl ${magicOpen ? 'bg-[#7b2fff]' : 'bg-gradient-to-br from-[#7b2fff] to-[#00c8ff]'}`}
            style={{ boxShadow: '0 0 30px rgba(123,47,255,0.4)' }}
            title="Magic Box — AI Commands">
            🪄
          </button>
        </div>
      )}
    </div>
  )
}