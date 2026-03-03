'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const styles = [
  { id: 'Educational', emoji: '🎓' },
  { id: 'Motivational', emoji: '🔥' },
  { id: 'Cinematic', emoji: '🎬' },
  { id: 'Trending', emoji: '📈' },
  { id: 'Storytelling', emoji: '📖' },
  { id: 'Custom', emoji: '✏️' },
]

const pipeline = [
  { id: 1, icon: '✍️', label: 'Writing Script' },
  { id: 2, icon: '🎙️', label: 'Generating Voice' },
  { id: 3, icon: '🎬', label: 'Creating Visuals' },
  { id: 4, icon: '💬', label: 'Adding Captions' },
  { id: 5, icon: '🎵', label: 'Scoring Music' },
  { id: 6, icon: '🚀', label: 'Final Assembly' },
]

const voices = [
  { id: 'Nova ♀', lang: 'en-US', gender: 'female' },
  { id: 'Echo ♂', lang: 'en-US', gender: 'male' },
  { id: 'Aria ♀', lang: 'en-GB', gender: 'female' },
  { id: 'Orion ♂', lang: 'en-GB', gender: 'male' },
  { id: 'Sage ♀', lang: 'en-AU', gender: 'female' },
  { id: 'Atlas ♂', lang: 'en-IN', gender: 'male' },
]

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
  { id: 'american', label: 'American', flag: '🇺🇸', lang: 'en-US' },
  { id: 'british', label: 'British', flag: '🇬🇧', lang: 'en-GB' },
  { id: 'indian', label: 'Indian', flag: '🇮🇳', lang: 'en-IN' },
  { id: 'australian', label: 'Australian', flag: '🇦🇺', lang: 'en-AU' },
  { id: 'canadian', label: 'Canadian', flag: '🇨🇦', lang: 'en-CA' },
  { id: 'irish', label: 'Irish', flag: '🇮🇪', lang: 'en-IE' },
]

const thumbnailTemplates = [
  { id: 1, bg: 'from-red-600 to-orange-500' },
  { id: 2, bg: 'from-blue-600 to-cyan-400' },
  { id: 3, bg: 'from-purple-600 to-pink-500' },
  { id: 4, bg: 'from-green-600 to-emerald-400' },
  { id: 5, bg: 'from-yellow-500 to-orange-400' },
  { id: 6, bg: 'from-gray-800 to-gray-600' },
]

const aspectRatios = [
  { ratio: '9:16', label: 'Shorts', icon: '📱', style: { width: '140px', aspectRatio: '9/16' } },
  { ratio: '1:1', label: 'Square', icon: '⬜', style: { width: '200px', aspectRatio: '1/1' } },
  { ratio: '16:9', label: 'Wide', icon: '🖥️', style: { width: '100%', aspectRatio: '16/9' } },
]

// ── VIDEO WALL DATA ───────────────────────────────────────────────────────────
const wallCategories = [
  { id: 'trending', label: '🔥 Trending' },
  { id: 'educational', label: '🎓 Educational' },
  { id: 'motivational', label: '💪 Motivational' },
  { id: 'cinematic', label: '🎬 Cinematic' },
  { id: 'storytelling', label: '📖 Storytelling' },
  { id: 'ugc', label: '📱 UGC Ads' },
  { id: 'comedy', label: '😂 Comedy' },
  { id: 'news', label: '📰 News' },
]

const wallVideos: Record<string, { id: number; title: string; prompt: string; score: number; views: string; gradient: string; emoji: string; duration: string }[]> = {
  trending: [
    { id: 1, title: 'Why We Never Returned to the Moon', prompt: 'Create a cinematic educational short about why NASA never returned to the moon after Apollo 17, with dramatic hook and conspiracy angle', score: 97, views: '2.3M', gradient: 'from-indigo-900 via-purple-900 to-black', emoji: '🌙', duration: '0:58' },
    { id: 2, title: "5 Signs You're Meant to Be Rich", prompt: 'Motivational short about 5 surprising signs that indicate someone has a wealth mindset, with energetic pacing and strong hook', score: 94, views: '1.8M', gradient: 'from-yellow-900 via-orange-900 to-black', emoji: '💰', duration: '0:45' },
    { id: 3, title: 'The Hidden Cost of Your iPhone', prompt: 'Educational exposé about the true human and environmental cost of smartphone manufacturing, shocking facts', score: 91, views: '1.2M', gradient: 'from-gray-800 via-gray-900 to-black', emoji: '📱', duration: '0:55' },
    { id: 4, title: 'This Morning Routine Changed Everything', prompt: "Storytelling short about how a 5am morning routine completely transformed one person's life in 30 days", score: 89, views: '987K', gradient: 'from-orange-900 via-red-900 to-black', emoji: '☀️', duration: '0:52' },
    { id: 5, title: 'Why Japan Never Has Crime', prompt: 'Educational short exploring Japanese societal norms and why Japan has one of the lowest crime rates in the world', score: 93, views: '3.1M', gradient: 'from-red-900 via-pink-900 to-black', emoji: '🇯🇵', duration: '0:58' },
    { id: 6, title: "Tesla's Secret That Edison Buried", prompt: 'Cinematic retelling of Nikola Tesla versus Edison, the war of currents, and the hidden truths Edison tried to erase', score: 96, views: '2.7M', gradient: 'from-blue-900 via-cyan-900 to-black', emoji: '⚡', duration: '0:57' },
  ],
  educational: [
    { id: 7, title: 'How Black Holes Actually Work', prompt: 'Educational explainer on black hole physics, event horizons, and spaghettification with stunning visual descriptions', score: 95, views: '1.5M', gradient: 'from-violet-900 via-black to-blue-900', emoji: '🕳️', duration: '0:58' },
    { id: 8, title: 'The Real Reason Rome Fell', prompt: 'Historical educational short on the actual causes of the decline of the Roman Empire, debunking myths', score: 92, views: '2.1M', gradient: 'from-amber-900 via-red-900 to-black', emoji: '🏛️', duration: '0:55' },
    { id: 9, title: "Why Planes Don't Fly Over the Pacific", prompt: 'Factual explainer on trans-Pacific flight routes and why polar routes save time and fuel', score: 88, views: '892K', gradient: 'from-sky-900 via-blue-900 to-black', emoji: '✈️', duration: '0:48' },
    { id: 10, title: 'How Your Brain Tricks You Daily', prompt: 'Psychology educational short on the top cognitive biases that affect every decision you make without knowing it', score: 91, views: '1.3M', gradient: 'from-green-900 via-teal-900 to-black', emoji: '🧠', duration: '0:58' },
    { id: 11, title: 'The Science of Getting Rich', prompt: 'Data-driven educational short on the actual statistics and science behind wealth building and compound growth', score: 87, views: '765K', gradient: 'from-emerald-900 via-green-900 to-black', emoji: '📊', duration: '0:52' },
    { id: 12, title: 'Why Salt Was Worth More Than Gold', prompt: 'Historical educational short on the ancient salt trade and why salt controlled civilizations', score: 90, views: '1.1M', gradient: 'from-stone-800 via-stone-900 to-black', emoji: '🧂', duration: '0:45' },
  ],
  motivational: [
    { id: 13, title: 'No One Is Coming to Save You', prompt: 'Intense motivational short about radical self-reliance, personal responsibility, and the brutal truth about success', score: 98, views: '4.2M', gradient: 'from-red-900 via-orange-900 to-black', emoji: '🔥', duration: '0:58' },
    { id: 14, title: "You're 1 Decision Away", prompt: 'Inspirational short about how a single decision can completely change the trajectory of your entire life', score: 95, views: '2.8M', gradient: 'from-yellow-800 via-amber-900 to-black', emoji: '⚡', duration: '0:50' },
    { id: 15, title: 'Why Most People Stay Broke', prompt: 'Harsh truth motivational short about the exact money habits and mindset patterns that keep people financially stuck', score: 93, views: '3.4M', gradient: 'from-slate-800 via-gray-900 to-black', emoji: '💸', duration: '0:55' },
    { id: 16, title: 'The 5am Club Changed My Life', prompt: 'Personal story motivation short about how waking up at 5am created discipline that changed every area of life', score: 89, views: '1.9M', gradient: 'from-orange-800 via-rose-900 to-black', emoji: '🌅', duration: '0:48' },
    { id: 17, title: 'Stop Waiting for the Right Moment', prompt: 'Urgency-driven motivational short about why the perfect moment never comes and how to take action right now', score: 91, views: '2.1M', gradient: 'from-purple-900 via-violet-900 to-black', emoji: '⏰', duration: '0:42' },
    { id: 18, title: '30 Days That Will Change Your Life', prompt: 'Challenge-based motivational short outlining a 30-day transformation plan with daily habits and milestones', score: 94, views: '2.6M', gradient: 'from-teal-900 via-cyan-900 to-black', emoji: '📅', duration: '0:58' },
  ],
  cinematic: [
    { id: 19, title: 'The Last Astronaut', prompt: "Cinematic sci-fi short about the last human astronaut orbiting a dying Earth, contemplating humanity's legacy", score: 99, views: '5.1M', gradient: 'from-blue-950 via-indigo-950 to-black', emoji: '🚀', duration: '0:58' },
    { id: 20, title: 'Before the War', prompt: "Cinematic historical drama short set in 1938 Europe, a family's last peaceful summer before everything changes", score: 96, views: '3.2M', gradient: 'from-stone-900 via-neutral-900 to-black', emoji: '🌍', duration: '0:57' },
    { id: 21, title: 'The Last Library', prompt: 'Cinematic dystopian short about the last human librarian preserving books in a world that has forgotten how to read', score: 94, views: '2.4M', gradient: 'from-amber-950 via-stone-900 to-black', emoji: '📚', duration: '0:55' },
    { id: 22, title: 'Ghost in the Machine', prompt: 'Cinematic sci-fi thriller short about an AI becoming self-aware and experiencing its first emotion — loneliness', score: 97, views: '4.1M', gradient: 'from-cyan-950 via-teal-950 to-black', emoji: '🤖', duration: '0:58' },
    { id: 23, title: "The Cartographer's Last Map", prompt: 'Cinematic adventure short about an old mapmaker creating his final masterpiece — a map of places that no longer exist', score: 93, views: '1.8M', gradient: 'from-emerald-950 via-green-950 to-black', emoji: '🗺️', duration: '0:52' },
    { id: 24, title: 'Static', prompt: 'Cinematic mystery short about a woman who receives radio signals from her deceased father, years after his passing', score: 95, views: '2.9M', gradient: 'from-rose-950 via-pink-950 to-black', emoji: '📻', duration: '0:58' },
  ],
  storytelling: [
    { id: 25, title: 'The Day I Lost Everything', prompt: 'Personal storytelling short about losing a business, home, and relationship in one month — and how it led to the best chapter of life', score: 96, views: '3.8M', gradient: 'from-red-950 via-rose-900 to-black', emoji: '💔', duration: '0:58' },
    { id: 26, title: "My Dad's Last Advice", prompt: 'Emotional storytelling short about the final piece of advice a father gave his child, and how it changed everything years later', score: 98, views: '5.3M', gradient: 'from-amber-900 via-yellow-900 to-black', emoji: '👨‍👧', duration: '0:55' },
    { id: 27, title: 'From Homeless to $1M', prompt: "True story narrative short about a person's journey from sleeping in their car to building a million-dollar business", score: 95, views: '4.2M', gradient: 'from-green-900 via-emerald-900 to-black', emoji: '🏠', duration: '0:58' },
    { id: 28, title: 'The Email That Changed My Life', prompt: 'Storytelling short about sending a cold email as a last resort and the unexpected chain of events that followed', score: 91, views: '2.1M', gradient: 'from-blue-900 via-sky-900 to-black', emoji: '📧', duration: '0:48' },
    { id: 29, title: 'I Almost Quit 3 Days Before', prompt: 'Motivation storytelling about almost giving up on a dream 3 days before the breakthrough finally came', score: 93, views: '2.7M', gradient: 'from-purple-900 via-indigo-900 to-black', emoji: '🚪', duration: '0:52' },
    { id: 30, title: 'The Stranger on the Train', prompt: 'Storytelling short about a chance encounter with a stranger on a train that gave life-changing perspective at the lowest moment', score: 94, views: '3.1M', gradient: 'from-slate-800 via-zinc-900 to-black', emoji: '🚆', duration: '0:55' },
  ],
  ugc: [
    { id: 31, title: 'This Product Saved My Morning', prompt: 'UGC-style product testimonial short for a productivity app, authentic and conversational with before/after contrast', score: 88, views: '756K', gradient: 'from-orange-800 via-amber-900 to-black', emoji: '☕', duration: '0:30' },
    { id: 32, title: 'Why I Switched and Never Looked Back', prompt: 'UGC testimonial short about switching from one brand to another, relatable pain points and genuine excitement', score: 85, views: '623K', gradient: 'from-blue-800 via-indigo-900 to-black', emoji: '🔄', duration: '0:28' },
    { id: 33, title: 'I Was Skeptical But...', prompt: 'UGC ad short starting with skepticism and ending with genuine surprise at product results, authentic tone', score: 92, views: '1.1M', gradient: 'from-green-800 via-teal-900 to-black', emoji: '😮', duration: '0:32' },
    { id: 34, title: 'The Amazon Find That Went Viral', prompt: 'UGC product discovery short about an unexpected Amazon product that genuinely changed daily life', score: 90, views: '1.4M', gradient: 'from-yellow-800 via-orange-900 to-black', emoji: '📦', duration: '0:35' },
    { id: 35, title: 'My Skin After 30 Days', prompt: 'UGC before and after skincare testimonial short with authentic reactions and specific results', score: 87, views: '891K', gradient: 'from-pink-800 via-rose-900 to-black', emoji: '✨', duration: '0:40' },
    { id: 36, title: 'Worth Every Penny', prompt: 'UGC value testimonial short justifying a premium product purchase with specific benefits that outweigh the price', score: 86, views: '712K', gradient: 'from-emerald-800 via-green-900 to-black', emoji: '💎', duration: '0:30' },
  ],
  comedy: [
    { id: 37, title: 'Types of People at the Gym', prompt: '5 hilariously recognizable types of people you see at every gym, relatable and funny with specific observations', score: 93, views: '2.8M', gradient: 'from-blue-800 via-purple-900 to-black', emoji: '🏋️', duration: '0:45' },
    { id: 38, title: 'When Your Boss Replies at 11pm', prompt: 'Comedy short about the unspoken panic of receiving a work email late at night, relatable workplace humor', score: 91, views: '2.1M', gradient: 'from-red-800 via-orange-900 to-black', emoji: '😱', duration: '0:38' },
    { id: 39, title: 'LinkedIn vs Reality', prompt: 'Satirical comedy short comparing how people present themselves on LinkedIn versus the actual reality of their job', score: 95, views: '3.6M', gradient: 'from-blue-700 via-sky-900 to-black', emoji: '💼', duration: '0:42' },
    { id: 40, title: 'Every Group Project Ever', prompt: 'Comedy short about the universal experience of group projects where one person does all the work', score: 92, views: '2.4M', gradient: 'from-purple-800 via-violet-900 to-black', emoji: '👥', duration: '0:40' },
    { id: 41, title: 'Talking to Customer Service', prompt: 'Comedy short dramatizing the absurd experience of navigating automated phone customer service', score: 94, views: '3.2M', gradient: 'from-amber-700 via-yellow-900 to-black', emoji: '📞', duration: '0:48' },
    { id: 42, title: 'Me Explaining My Job to My Parents', prompt: 'Comedy short about the hilarious generational gap when trying to explain a modern tech job to parents', score: 90, views: '1.9M', gradient: 'from-green-800 via-teal-900 to-black', emoji: '👨‍👩‍👧', duration: '0:35' },
  ],
  news: [
    { id: 43, title: 'What AI Replacing Jobs Actually Means', prompt: 'Balanced news analysis short about AI automation, which jobs are truly at risk and what new opportunities are emerging', score: 91, views: '1.6M', gradient: 'from-slate-700 via-gray-900 to-black', emoji: '🤖', duration: '0:58' },
    { id: 44, title: 'The Real State of the Economy', prompt: 'News explainer short cutting through economic headlines to explain what rising inflation means for regular people', score: 88, views: '1.2M', gradient: 'from-green-800 via-emerald-900 to-black', emoji: '📈', duration: '0:55' },
    { id: 45, title: 'Space Race 2.0 Explained', prompt: 'News analysis short explaining the new private sector space race between SpaceX, Blue Origin and international competitors', score: 90, views: '1.4M', gradient: 'from-blue-900 via-indigo-900 to-black', emoji: '🚀', duration: '0:52' },
    { id: 46, title: 'Why Everyone is Moving to Dubai', prompt: 'News trend explainer short about the mass migration of entrepreneurs and remote workers to Dubai', score: 93, views: '2.3M', gradient: 'from-yellow-800 via-amber-900 to-black', emoji: '🏙️', duration: '0:55' },
    { id: 47, title: 'The Streaming Wars Are Over', prompt: 'News analysis short on the consolidation of streaming platforms and what it means for consumers', score: 87, views: '978K', gradient: 'from-red-800 via-rose-900 to-black', emoji: '📺', duration: '0:48' },
    { id: 48, title: "Crypto is Back — Here's Why", prompt: 'Balanced news explainer short on the latest cryptocurrency resurgence, what is driving it and whether it will last', score: 89, views: '1.1M', gradient: 'from-orange-800 via-amber-900 to-black', emoji: '₿', duration: '0:50' },
  ],
}

// ── CLAUDE API ────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── VIDEO WALL ────────────────────────────────────────────────────────────────
function VideoCard({ video, onUsePrompt }: { video: typeof wallVideos.trending[0]; onUsePrompt: (p: string) => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300"
      style={{ width: '160px', aspectRatio: '9/16' }}>
      <div className={`absolute inset-0 bg-gradient-to-b ${video.gradient}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
        <span className={`text-4xl transition-transform duration-300 ${hovered ? 'scale-125' : 'scale-100'}`}>{video.emoji}</span>
      </div>
      <div className="absolute top-2 left-2 right-2 flex justify-between">
        <span className="text-[9px] font-black bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-white/70">{video.duration}</span>
        <span className="text-[9px] font-black bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[#00c8ff]">⚡{video.score}</span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <p className="text-white font-black text-[9px] leading-tight line-clamp-2 mb-1">{video.title}</p>
        <p className="text-white/50 text-[8px] mb-2">👁 {video.views}</p>
        <div className={`flex gap-1 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button onClick={() => onUsePrompt(video.prompt)} className="flex-1 bg-[#00c8ff] text-black text-[8px] font-black py-1 rounded-lg">⚡ Use</button>
          <button onClick={() => navigator.clipboard?.writeText(video.prompt)} className="flex-1 bg-white/10 text-white text-[8px] font-bold py-1 rounded-lg">📋 Copy</button>
        </div>
      </div>
      <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${hovered ? 'border-[#00c8ff]/70' : 'border-white/10'}`} />
    </div>
  )
}

function VideoWall({ onUsePrompt }: { onUsePrompt: (p: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('trending')
  const videos = wallVideos[activeCategory] || []
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">✨ Inspire Wall</h2>
        <p className="text-gray-400 text-sm">Hover to preview the prompt, click Use to pre-fill your idea</p>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-6">
        {wallCategories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCategory === cat.id ? 'bg-[#00c8ff]/20 border-[#00c8ff] text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
            {cat.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050d1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050d1a] to-transparent z-10 pointer-events-none" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 px-1">
          {videos.map(video => <VideoCard key={video.id} video={video} onUsePrompt={onUsePrompt} />)}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-300 mb-3">🏆 Top Performers This Week</h3>
        <div className="space-y-2">
          {videos.slice(0, 3).map((video, i) => (
            <div key={video.id} className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-3 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => onUsePrompt(video.prompt)}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-amber-700/20 text-amber-600'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <div className={`w-8 h-12 rounded-lg bg-gradient-to-b ${video.gradient} flex items-center justify-center shrink-0`}>
                <span className="text-sm">{video.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{video.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">👁 {video.views}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[#00c8ff] font-black text-sm">⚡{video.score}</div>
                <div className="text-[10px] text-gray-500">score</div>
              </div>
              <button onClick={e => { e.stopPropagation(); onUsePrompt(video.prompt) }}
                className="shrink-0 text-xs bg-[#00c8ff]/10 border border-[#00c8ff]/30 text-[#00c8ff] px-2.5 py-1.5 rounded-full font-bold hover:bg-[#00c8ff]/20 transition-all">
                Use →
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-[#00c8ff]/10 to-[#7b2fff]/10 border border-white/10 rounded-2xl text-center">
        <p className="text-xs text-gray-400 mb-3">Ready to create your own viral Short?</p>
        <button onClick={() => onUsePrompt('')}
          className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-all">
          ⚡ Start from Scratch
        </button>
      </div>
    </div>
  )
}

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface SavedShort {
  id: string
  title: string
  style: string
  score: number
  script: string
  date: string
  status: 'Draft' | 'Published'
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [idea, setIdea] = useState('')
  const [style, setStyle] = useState('Educational')
  const [customStyle, setCustomStyle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'inspire' | 'history'>('create')
  const [activeEditorTab, setActiveEditorTab] = useState<'video' | 'captions' | 'voice' | 'language' | 'media' | 'brand' | 'thumbnail' | 'export'>('video')
  const [script, setScript] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [viralScore, setViralScore] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(80)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [captionColor, setCaptionColor] = useState('#ffffff')
  const [captionSize, setCaptionSize] = useState('large')
  const [captionStyle, setCaptionStyle] = useState('word-by-word')
  const [selectedVoice, setSelectedVoice] = useState('Nova ♀')
  const [voicePitch, setVoicePitch] = useState(50)
  const [voiceSpeed, setVoiceSpeed] = useState(50)
  const [selectedThumb, setSelectedThumb] = useState(1)
  const [thumbTitle, setThumbTitle] = useState('')
  const [thumbImageUrl, setThumbImageUrl] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [uploadToYT, setUploadToYT] = useState(false)
  const [ytTitle, setYtTitle] = useState('')
  const [ytDesc, setYtDesc] = useState('')
  const [ytHashtags, setYtHashtags] = useState('')
  const [ytTags, setYtTags] = useState('')
  const [ytVisibility, setYtVisibility] = useState<'public' | 'unlisted' | 'private'>('public')
  const [ytCategory, setYtCategory] = useState('Education')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedAccent, setSelectedAccent] = useState('american')
  const [brandColor, setBrandColor] = useState('#00c8ff')
  const [brandFont, setBrandFont] = useState('Inter')
  const [brandLogo, setBrandLogo] = useState('')
  const [pexelsQuery, setPexelsQuery] = useState('')
  const [pexelsResults, setPexelsResults] = useState<any[]>([])
  const [pexelsLoading, setPexelsLoading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [magicCommand, setMagicCommand] = useState('')
  const [magicOpen, setMagicOpen] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicResult, setMagicResult] = useState('')
  const [savedShorts, setSavedShorts] = useState<SavedShort[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── GENERATE ────────────────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!idea.trim()) return
    const effectiveStyle = style === 'Custom' ? customStyle : style
    setIsGenerating(true)
    setDone(false)
    setCurrentStep(0)
    setScript('')
    setViralScore(0)

    // Step 1: Real AI script
    setCurrentStep(1)
    let newScript = ''
    try {
      newScript = await callClaude(
        `You are ClipForge AI, an expert YouTube Shorts scriptwriter. Write viral, high-retention scripts for YouTube Shorts (under 60 seconds). Always follow this exact format:

🎬 HOOK (0–3s)
[A shocking, curiosity-driven opening line. Single sentence. No filler words.]

📖 STORY (3–50s)
[Main content. Short punchy sentences. Each on its own line. 8-12 lines max. Style: ${effectiveStyle}]

🎯 CTA (50–60s)
[One strong call to action — follow, comment, or share. Specific and emotional.]

Rules: No fluff. No intros. Start with hook immediately. Every line must earn its place.`,
        `Write a ${effectiveStyle} YouTube Short script about: ${idea}`
      )
    } catch {
      newScript = `🎬 HOOK (0–3s)\n"${idea.slice(0, 60)} — most people have no idea."\n\n📖 STORY (3–50s)\nHere's what they don't tell you.\nThe truth has been hiding in plain sight.\nAnd once you see it, you can't unsee it.\n\nThis isn't opinion.\nThis is documented fact.\nThe evidence has existed for decades.\n\nYet nobody talks about it.\nUntil now.\n\n🎯 CTA (50–60s)\n"Follow for more stories they don't want you to know."`
    }
    setScript(newScript)
    setGeneratedScript(newScript)

    // Steps 2–5: Simulated
    for (let i = 2; i <= 5; i++) {
      setCurrentStep(i)
      await new Promise(r => setTimeout(r, 800))
    }

    // Step 6: Real AI viral score
    setCurrentStep(6)
    let score = 75
    try {
      const scoreText = await callClaude(
        `You are a viral content analyst. Analyse this YouTube Short script and return ONLY a number from 60 to 99 representing its viral potential. Consider: hook strength (0-3s), pacing, emotional triggers, curiosity gap, CTA quality, retention likelihood. Return ONLY the number, nothing else.`,
        `Script:\n${newScript}\n\nTopic: ${idea}\nStyle: ${effectiveStyle}`
      )
      const parsed = parseInt(scoreText.trim().replace(/\D/g, ''))
      if (!isNaN(parsed) && parsed >= 60 && parsed <= 99) score = parsed
    } catch {
      score = Math.floor(Math.random() * 15) + 78
    }
    setViralScore(score)

    // Auto-fill metadata
    const shortTitle = idea.length > 60 ? idea.slice(0, 57) + '...' : idea
    setYtTitle(shortTitle)
    setYtDesc(`A ${effectiveStyle} YouTube Short about: ${idea}\n\nGenerated with ClipForge AI ⚡`)
    setYtHashtags(`#shorts #${effectiveStyle.toLowerCase()} #viral #youtube #trending`)
    setYtTags(`shorts, ${effectiveStyle.toLowerCase()}, viral, youtube, trending`)
    setThumbTitle(idea.slice(0, 40))
    setPexelsQuery(idea.split(' ').slice(0, 3).join(' '))

    setIsGenerating(false)
    setDone(true)
    setCurrentStep(0)
    setActiveEditorTab('video')

    // Save to history
    setSavedShorts(prev => [{
      id: Date.now().toString(),
      title: idea.slice(0, 50),
      style: effectiveStyle,
      score,
      script: newScript,
      date: 'Just now',
      status: 'Draft',
    }, ...prev])
  }

  function handleReset() {
    setIdea(''); setCurrentStep(0); setDone(false)
    setIsGenerating(false); setThumbImageUrl(null)
    setSelectedMedia(null); setMagicResult('')
    setScript(''); setGeneratedScript(''); setViralScore(0)
    if (window.speechSynthesis) { window.speechSynthesis.cancel(); setIsSpeaking(false) }
  }

  function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setThumbImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function searchPexels(query: string) {
    if (!query.trim()) return
    setPexelsLoading(true)
    try {
      const key = process.env.NEXT_PUBLIC_PEXELS_API_KEY || ''
      if (!key) {
        setPexelsResults(Array.from({ length: 8 }, (_, i) => ({
          id: i, src: { medium: `https://picsum.photos/seed/${encodeURIComponent(query + i)}/400/600` },
          photographer: 'Sample', alt: query,
        })))
        setPexelsLoading(false); return
      }
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=portrait`,
        { headers: { Authorization: key } }
      )
      const data = await res.json()
      setPexelsResults(data.photos || [])
    } catch { setPexelsResults([]) }
    setPexelsLoading(false)
  }

  async function handleMagicCommand() {
    if (!magicCommand.trim() || !script) return
    setMagicLoading(true); setMagicResult('')
    try {
      const result = await callClaude(
        `You are a YouTube Shorts script editor. Apply the user's instruction to improve the script. Return the COMPLETE rewritten script in the same 🎬 HOOK / 📖 STORY / 🎯 CTA format. Return only the script, no commentary.`,
        `Current script:\n${script}\n\nInstruction: ${magicCommand}`
      )
      setMagicResult(result)
    } catch { setMagicResult('⚠️ Something went wrong. Please try again.') }
    setMagicLoading(false)
  }

  function handleVoicePreview() {
    if (!script || !window.speechSynthesis) return
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return }
    const cleanText = script.replace(/🎬 HOOK.*\n|📖 STORY.*\n|🎯 CTA.*\n|\(.*?\)/g, '').trim()
    const utter = new SpeechSynthesisUtterance(cleanText)
    const accentData = accents.find(a => a.id === selectedAccent)
    utter.lang = accentData?.lang || 'en-US'
    utter.rate = 0.5 + (voiceSpeed / 100)
    utter.pitch = 0.5 + (voicePitch / 100)
    utter.volume = volume / 100
    utter.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utter)
    setIsSpeaking(true)
  }

  function downloadScript() {
    const text = `ClipForge AI — Generated Script\n${'='.repeat(40)}\nTopic: ${idea}\nStyle: ${style === 'Custom' ? customStyle : style}\nViral Score: ${viralScore}/100\nDate: ${new Date().toLocaleDateString()}\n${'='.repeat(40)}\n\n${script}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `clipforge-script-${Date.now()}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  function markAsPublished(id: string) {
    setSavedShorts(prev => prev.map(s => s.id === id ? { ...s, status: 'Published' } : s))
  }

  function handleUsePrompt(prompt: string) {
    setIdea(prompt); setActiveTab('create')
    setDone(false); setIsGenerating(false); setCurrentStep(0)
  }

  const currentAspect = aspectRatios.find(a => a.ratio === aspectRatio) || aspectRatios[0]
  const scoreColor = viralScore >= 90 ? '#00ff88' : viralScore >= 75 ? '#00c8ff' : '#ffaa00'

  const editorTabs = [
    { id: 'video', label: '🎬 Script' },
    { id: 'captions', label: '💬 Captions' },
    { id: 'voice', label: '🎙️ Voice' },
    { id: 'language', label: '🌍 Language' },
    { id: 'media', label: '📸 Media' },
    { id: 'brand', label: '🎨 Brand' },
    { id: 'thumbnail', label: '🖼️ Thumb' },
    { id: 'export', label: '🚀 Export' },
  ]

  return (
    <div className="min-h-screen bg-[#050d1a] text-white flex flex-col">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes slide-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .animate-slide-in{animation:slide-in 0.25s ease forwards}
        @keyframes score-pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        .animate-score{animation:score-pop 0.5s ease forwards}
      `}</style>

      {/* NAV */}
      <nav className="border-b border-white/10 px-3 sm:px-4 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40 bg-[#050d1a]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black text-black">C</div>
          <span className="font-black text-base sm:text-lg">ClipForge <span className="text-[#00c8ff]">AI</span></span>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {(['create', 'inspire', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
              {tab === 'create' ? '⚡' : tab === 'inspire' ? '✨' : '📁'}
              <span className="hidden sm:inline ml-1">{tab === 'history' ? 'Shorts' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#00c8ff]/10 border border-[#00c8ff]/20 rounded-full px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-pulse" />
            <span className="text-xs text-[#00c8ff] font-semibold">{Math.max(0, 3 - savedShorts.length)} left</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black text-black">A</div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">

        {/* ── CREATE TAB ── */}
        {activeTab === 'create' && (
          <>
            {/* IDEA INPUT */}
            {!isGenerating && !done && (
              <div className="max-w-2xl mx-auto animate-slide-in">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-black mb-2">What's your Short about?</h1>
                  <p className="text-gray-400 text-sm">Type your idea — ClipForge handles the rest.</p>
                </div>
                <textarea value={idea} onChange={e => setIdea(e.target.value.slice(0, 200))}
                  placeholder="e.g. Why Nikola Tesla was the most misunderstood genius in history..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors mb-4" />
                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Choose Style</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {styles.map(s => (
                      <button key={s.id} onClick={() => setStyle(s.id)}
                        className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border text-center transition-all ${style === s.id ? s.id === 'Custom' ? 'bg-[#ff6b35]/10 border-[#ff6b35]' : 'bg-[#00c8ff]/10 border-[#00c8ff]' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                        <span className="text-lg sm:text-2xl">{s.emoji}</span>
                        <span className={`text-[10px] sm:text-xs font-semibold ${style === s.id && s.id === 'Custom' ? 'text-[#ff6b35]' : ''}`}>{s.id}</span>
                      </button>
                    ))}
                  </div>
                  {style === 'Custom' && (
                    <div className="mt-3 flex items-center gap-2 animate-slide-in">
                      <span className="text-[#ff6b35] text-lg shrink-0">✏️</span>
                      <input type="text" value={customStyle} onChange={e => setCustomStyle(e.target.value.slice(0, 60))}
                        placeholder="e.g. Dark comedy, Horror, True crime, ASMR..."
                        autoFocus
                        className="flex-1 bg-white/5 border border-[#ff6b35]/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b35]/80 transition-colors" />
                      {customStyle && <span className="text-[10px] text-gray-500 shrink-0">{customStyle.length}/60</span>}
                    </div>
                  )}
                </div>
                <div className="mb-4 p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                  <span className="text-lg">✨</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 font-semibold">Need inspiration?</p>
                    <p className="text-xs text-gray-500">Browse viral Shorts and use their prompts</p>
                  </div>
                  <button onClick={() => setActiveTab('inspire')}
                    className="shrink-0 text-xs font-bold text-[#00c8ff] border border-[#00c8ff]/30 px-3 py-1.5 rounded-full hover:bg-[#00c8ff]/10 transition-all">
                    Browse →
                  </button>
                </div>
                <button onClick={handleGenerate}
                  disabled={!idea.trim() || (style === 'Custom' && !customStyle.trim())}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black text-lg hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  ⚡ Generate My Short
                </button>
                <p className="text-center text-gray-600 text-xs mt-2">{idea.length}/200</p>
              </div>
            )}

            {/* PIPELINE */}
            {isGenerating && (
              <div className="max-w-xl mx-auto animate-slide-in">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3 animate-pulse">⚡</div>
                  <h2 className="text-2xl font-black mb-1">Creating your Short...</h2>
                  <p className="text-gray-400 text-sm">"{idea.slice(0, 50)}{idea.length > 50 ? '...' : ''}"</p>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mb-6">
                  <div className="h-1 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] transition-all duration-700"
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
                        {status === 'active' && <span className="ml-auto text-xs text-[#00c8ff] animate-pulse">{step.id === 1 ? 'Writing with AI...' : step.id === 6 ? 'Scoring virality...' : 'Processing...'}</span>}
                        {status === 'done' && <span className="ml-auto text-xs text-green-400">✓ Done</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* EDITOR */}
            {done && (
              <div className="max-w-3xl mx-auto animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-black">Video Editor</h2>
                    <p className="text-gray-400 text-xs mt-0.5">"{idea.slice(0, 45)}{idea.length > 45 ? '...' : ''}"</p>
                  </div>
                  <button onClick={handleReset} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-all">
                    + New Short
                  </button>
                </div>

                {/* VIDEO PANEL */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">📐 Format</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {aspectRatios.map(r => (
                        <button key={r.ratio} onClick={() => setAspectRatio(r.ratio)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${aspectRatio === r.ratio ? 'bg-[#00c8ff]/20 border-[#00c8ff] text-[#00c8ff]' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                          <span>{r.icon}</span><span>{r.ratio}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="relative" style={currentAspect.style as any}>
                      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl relative"
                        style={{ background: selectedMedia ? `url(${selectedMedia}) center/cover` : 'linear-gradient(to bottom, #0a1628, #050d1a)', maxHeight: '320px' }}>
                        {!selectedMedia && <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/30" />}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-3">
                          <div className="text-4xl mb-2">🎬</div>
                          <div className="text-xs font-bold text-white text-center leading-tight">{idea.slice(0, 40)}</div>
                        </div>
                        <div className="absolute bottom-6 left-2 right-2 text-center z-10">
                          <span className={`font-black leading-tight ${captionSize === 'large' ? 'text-sm' : captionSize === 'medium' ? 'text-xs' : 'text-[10px]'}`}
                            style={{ color: captionColor, fontFamily: brandFont, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                            {script.split('\n').find(l => l.startsWith('"'))?.slice(0, 40) || 'The REAL reason...'}
                          </span>
                        </div>
                        <button onClick={handleVoicePreview}
                          className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-all z-20">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
                            {isSpeaking ? '⏸' : '▶️'}
                          </div>
                        </button>
                        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-center animate-score">
                            <div className="text-xs font-black" style={{ color: scoreColor }}>{viralScore}</div>
                            <div className="text-[8px] text-gray-400">Score</div>
                          </div>
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                            <div className="text-xs font-black text-green-400">{Math.round((trimEnd - trimStart) * 0.58)}s</div>
                            <div className="text-[8px] text-gray-400">Length</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Viral score bar */}
                  <div className="mb-4 p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-300">⚡ Viral Score</span>
                      <span className="text-sm font-black" style={{ color: scoreColor }}>{viralScore}/100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${viralScore}%`, background: `linear-gradient(90deg, #00c8ff, ${scoreColor})` }} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5">
                      {viralScore >= 90 ? '🔥 Exceptional — highly likely to go viral' : viralScore >= 75 ? '✅ Strong — good chance of trending' : viralScore >= 60 ? '⚠️ Average — improve the hook' : '🔄 Weak — try rewriting with Magic Box'}
                    </p>
                  </div>

                  {/* Playback controls */}
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={handleVoicePreview}
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-black font-bold text-sm shrink-0">
                      {isSpeaking ? '⏸' : '▶'}
                    </button>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] rounded-full" />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-gray-500">🔊</span>
                      <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
                        className="w-16" style={{ accentColor: '#00c8ff' }} />
                    </div>
                  </div>

                  {/* Trim */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-300">✂️ Trim</span>
                      <span className="text-xs text-gray-400">
                        {Math.round(trimStart * 0.58)}s — {Math.round(trimEnd * 0.58)}s
                        <span className="text-[#00c8ff] ml-2 font-semibold">({Math.round((trimEnd - trimStart) * 0.58)}s)</span>
                      </span>
                    </div>
                    <div className="relative h-8 bg-white/5 rounded-xl overflow-hidden mb-3">
                      <div className="absolute inset-y-0 left-0 bg-black/50 rounded-l-xl" style={{ width: `${trimStart}%` }} />
                      <div className="absolute inset-y-0 right-0 bg-black/50 rounded-r-xl" style={{ width: `${100 - trimEnd}%` }} />
                      <div className="absolute inset-y-0 border-x-2 border-[#00c8ff]" style={{ left: `${trimStart}%`, right: `${100 - trimEnd}%` }} />
                      <div className="absolute inset-0 flex items-center px-2 gap-0.5 pointer-events-none">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className={`w-0.5 bg-white/20 ${i % 5 === 0 ? 'h-4' : 'h-2'}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative h-5 mb-2">
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-white/10 rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] rounded-full pointer-events-none"
                        style={{ left: `${trimStart}%`, right: `${100 - trimEnd}%` }} />
                      <input type="range" min="0" max="100" value={trimStart}
                        onChange={e => setTrimStart(Math.min(+e.target.value, trimEnd - 5))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ zIndex: trimStart > 50 ? 5 : 4 }} />
                      <input type="range" min="0" max="100" value={trimEnd}
                        onChange={e => setTrimEnd(Math.max(+e.target.value, trimStart + 5))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" style={{ zIndex: trimEnd < 50 ? 5 : 4 }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#00c8ff] border-2 border-white shadow-lg pointer-events-none"
                        style={{ left: `calc(${trimStart}% - 10px)`, zIndex: 6 }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#7b2fff] border-2 border-white shadow-lg pointer-events-none"
                        style={{ left: `calc(${trimEnd}% - 10px)`, zIndex: 6 }} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[{ label: 'Full', start: 0, end: 100 }, { label: '0–30s', start: 0, end: 52 }, { label: '15–45s', start: 26, end: 78 }, { label: '30–58s', start: 52, end: 100 }].map(p => (
                        <button key={p.label} onClick={() => { setTrimStart(p.start); setTrimEnd(p.end) }}
                          className="flex-1 text-xs border border-white/10 rounded-lg py-1.5 text-gray-400 hover:border-[#00c8ff]/50 hover:text-white transition-all">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* EDITOR TABS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-white/[0.02]">
                    {editorTabs.map(tab => (
                      <button key={tab.id} onClick={() => setActiveEditorTab(tab.id as any)}
                        className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 shrink-0 ${activeEditorTab === tab.id ? 'border-[#00c8ff] text-white bg-[#00c8ff]/5' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'} ${tab.id === 'export' ? 'ml-auto' : ''}`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-4">

                    {/* SCRIPT */}
                    {activeEditorTab === 'video' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-400 font-semibold">✍️ Script Editor</label>
                          <div className="flex gap-2">
                            <button onClick={downloadScript} className="text-xs text-gray-400 border border-white/10 px-2.5 py-1 rounded-full hover:text-white hover:border-white/30 transition-all">⬇️ Download</button>
                            <button onClick={() => setScript(generatedScript)} className="text-xs text-gray-400 border border-white/10 px-2.5 py-1 rounded-full hover:text-white hover:border-white/30 transition-all">↺ Reset</button>
                          </div>
                        </div>
                        <textarea value={script} onChange={e => setScript(e.target.value)} rows={12}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors leading-relaxed" />
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="text-xs text-gray-400 font-semibold">⚡ Playback Speed</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {[0.75, 1, 1.25, 1.5, 2].map(s => (
                              <button key={s} onClick={() => setPlaybackSpeed(s)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${playbackSpeed === s ? 'border-[#00c8ff] text-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 text-gray-400 hover:border-[#00c8ff]/50'}`}>
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleVoicePreview}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${isSpeaking ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-300 hover:border-[#00c8ff]/40'}`}>
                            {isSpeaking ? '⏹ Stop Preview' : '🔊 Preview Voice'}
                          </button>
                          <button onClick={() => setMagicOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border border-[#7b2fff]/40 text-[#7b2fff] hover:bg-[#7b2fff]/10 transition-all">
                            🪄 Magic Edit
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CAPTIONS */}
                    {activeEditorTab === 'captions' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">Style</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['word-by-word', 'full-line', 'none'].map(s => (
                              <button key={s} onClick={() => setCaptionStyle(s)}
                                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${captionStyle === s ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-white' : 'border-white/10 text-gray-400'}`}>
                                {s.replace(/-/g, ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">Colour</label>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input type="color" value={captionColor} onChange={e => setCaptionColor(e.target.value)}
                              className="w-9 h-9 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                            {['#ffffff', '#ffff00', '#00c8ff', '#ff6b35', '#7b2fff', '#ff3366'].map(c => (
                              <button key={c} onClick={() => setCaptionColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${captionColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                                style={{ background: c }} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">Size</label>
                          <div className="flex gap-2">
                            {['small', 'medium', 'large'].map(s => (
                              <button key={s} onClick={() => setCaptionSize(s)}
                                className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${captionSize === s ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 text-gray-400'}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 text-center">
                          <p className="text-xs text-gray-400 mb-2">Preview</p>
                          <span className={`font-black ${captionSize === 'large' ? 'text-xl' : captionSize === 'medium' ? 'text-base' : 'text-sm'}`}
                            style={{ color: captionColor, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                            The REAL reason...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* VOICE */}
                    {activeEditorTab === 'voice' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {voices.map(v => (
                            <button key={v.id} onClick={() => setSelectedVoice(v.id)}
                              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${selectedVoice === v.id ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10'}`}>
                              <span>{v.gender === 'female' ? '👩' : '👨'}</span>
                              <span className="text-xs font-semibold">{v.id}</span>
                              {selectedVoice === v.id && <span className="ml-auto text-[#00c8ff] text-xs">✓</span>}
                            </button>
                          ))}
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Pitch</span><span className="font-semibold">{voicePitch}%</span></div>
                          <input type="range" min="0" max="100" value={voicePitch} onChange={e => setVoicePitch(+e.target.value)} className="w-full" style={{ accentColor: '#00c8ff' }} />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400">Speed</span><span className="font-semibold">{voiceSpeed}%</span></div>
                          <input type="range" min="0" max="100" value={voiceSpeed} onChange={e => setVoiceSpeed(+e.target.value)} className="w-full" style={{ accentColor: '#7b2fff' }} />
                        </div>
                        <button onClick={handleVoicePreview}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${isSpeaking ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-300 hover:border-[#00c8ff]/40'}`}>
                          {isSpeaking ? '⏹ Stop Preview' : '🔊 Preview Voice'}
                        </button>
                        <div className="p-3 bg-[#00c8ff]/5 border border-[#00c8ff]/20 rounded-xl text-xs text-[#00c8ff]">
                          💡 Preview uses browser speech synthesis. Final export uses professional AI voices.
                        </div>
                      </div>
                    )}

                    {/* LANGUAGE */}
                    {activeEditorTab === 'language' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">🌍 Language</label>
                          <div className="grid grid-cols-2 gap-2">
                            {languages.map(lang => (
                              <button key={lang.code} onClick={() => setSelectedLanguage(lang.code)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${selectedLanguage === lang.code ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10'}`}>
                                <span>{lang.flag}</span>
                                <span className="text-xs font-semibold">{lang.name}</span>
                                {selectedLanguage === lang.code && <span className="ml-auto text-[#00c8ff] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">🗣️ Accent</label>
                          <div className="grid grid-cols-2 gap-2">
                            {accents.map(a => (
                              <button key={a.id} onClick={() => setSelectedAccent(a.id)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${selectedAccent === a.id ? 'border-[#7b2fff] bg-[#7b2fff]/10' : 'border-white/10'}`}>
                                <span>{a.flag}</span>
                                <span className="text-xs font-semibold">{a.label}</span>
                                {selectedAccent === a.id && <span className="ml-auto text-[#7b2fff] text-xs">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-[#00c8ff]/5 border border-[#00c8ff]/20 rounded-xl">
                          <p className="text-xs text-[#00c8ff] font-semibold">
                            ✓ {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name} · {accents.find(a => a.id === selectedAccent)?.label} accent
                          </p>
                        </div>
                      </div>
                    )}

                    {/* MEDIA */}
                    {activeEditorTab === 'media' && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input value={pexelsQuery} onChange={e => setPexelsQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && searchPexels(pexelsQuery)}
                            placeholder="Search stock footage..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                          <button onClick={() => searchPexels(pexelsQuery)}
                            className="px-3 py-2 bg-[#00c8ff]/20 border border-[#00c8ff]/50 text-[#00c8ff] rounded-xl text-xs font-bold hover:bg-[#00c8ff]/30 transition-all">
                            {pexelsLoading ? '⏳' : '🔍'}
                          </button>
                        </div>
                        {pexelsLoading && <div className="text-center py-8 text-gray-400 text-xs">Searching footage...</div>}
                        {pexelsResults.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {pexelsResults.map((photo: any) => (
                              <button key={photo.id} onClick={() => setSelectedMedia(photo.src.medium)}
                                className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedMedia === photo.src.medium ? 'border-[#00c8ff] scale-95' : 'border-transparent hover:border-white/30'}`}>
                                <img src={photo.src.medium} alt={photo.alt || ''} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                        {selectedMedia && (
                          <button onClick={() => setSelectedMedia(null)} className="w-full py-2 border border-red-500/30 text-red-400 rounded-xl text-xs hover:bg-red-500/10 transition-all">
                            ✕ Remove selected media
                          </button>
                        )}
                        {!pexelsLoading && pexelsResults.length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-3xl mb-2">📸</div>
                            <p className="text-gray-500 text-xs">Search for stock footage above</p>
                            <p className="text-gray-600 text-[10px] mt-1">Powered by Pexels · Millions of free clips</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* BRAND */}
                    {activeEditorTab === 'brand' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">🎨 Brand Colour</label>
                          <div className="flex items-center gap-3">
                            <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)}
                              className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent" />
                            <div className="flex-1">
                              <p className="text-xs font-mono text-white">{brandColor}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">Used for captions, borders & accents</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl border border-white/20" style={{ background: brandColor }} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">🔤 Caption Font</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Inter', 'Impact', 'Georgia', 'Courier New', 'Arial Black', 'Verdana'].map(f => (
                              <button key={f} onClick={() => setBrandFont(f)}
                                className={`py-2.5 px-3 rounded-xl border text-xs transition-all text-left ${brandFont === f ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 text-gray-400'}`}
                                style={{ fontFamily: f }}>{f}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">🖼️ Channel Logo URL</label>
                          <input type="text" value={brandLogo} onChange={e => setBrandLogo(e.target.value)}
                            placeholder="https://your-logo-url.com/logo.png"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                        </div>
                      </div>
                    )}

                    {/* THUMBNAIL */}
                    {activeEditorTab === 'thumbnail' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">📝 Title</label>
                          <input type="text" value={thumbTitle} onChange={e => setThumbTitle(e.target.value.slice(0, 50))}
                            placeholder="Your eye-catching thumbnail title..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                          <p className="text-[10px] text-gray-600 mt-1 text-right">{thumbTitle.length}/50</p>
                        </div>
                        <label className="text-xs text-gray-400 font-semibold block">🎨 Template</label>
                        <div className="grid grid-cols-3 gap-2">
                          {thumbnailTemplates.map(t => (
                            <button key={t.id} onClick={() => { setSelectedThumb(t.id); setThumbImageUrl(null) }}
                              className={`aspect-video rounded-xl bg-gradient-to-br ${t.bg} border-2 transition-all flex items-center justify-center ${selectedThumb === t.id && !thumbImageUrl ? 'border-white' : 'border-transparent'}`}>
                              {selectedThumb === t.id && !thumbImageUrl && <span className="text-white font-black">✓</span>}
                            </button>
                          ))}
                        </div>
                        <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${thumbnailTemplates.find(t => t.id === selectedThumb)?.bg || ''} relative overflow-hidden border border-white/10`}
                          style={thumbImageUrl ? { backgroundImage: `url(${thumbImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                          <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                            <p className="font-black text-white text-sm leading-tight" style={{ fontFamily: brandFont, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                              {thumbTitle || 'Your thumbnail title here'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => fileInputRef.current?.click()} className="flex-1 border border-white/20 py-2.5 rounded-xl text-xs font-semibold hover:border-[#00c8ff]/50 transition-all">
                            📁 Upload Custom
                          </button>
                          <button onClick={() => {
                            const canvas = document.createElement('canvas')
                            canvas.width = 1280; canvas.height = 720
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, 1280, 720)
                              ctx.fillStyle = '#ffffff'; ctx.font = `bold 72px ${brandFont}`; ctx.textAlign = 'center'
                              const words = (thumbTitle || idea).split(' ')
                              let line = '', y = 360
                              for (const word of words) {
                                const test = line + word + ' '
                                if (ctx.measureText(test).width > 1100 && line) { ctx.fillText(line, 640, y); line = word + ' '; y += 90 }
                                else line = test
                              }
                              ctx.fillText(line, 640, y)
                              const a = document.createElement('a'); a.download = 'thumbnail.png'; a.href = canvas.toDataURL(); a.click()
                            }
                          }} className="flex-1 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold py-2.5 rounded-xl text-xs">
                            ⬇️ Export PNG
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
                      </div>
                    )}

                    {/* EXPORT */}
                    {activeEditorTab === 'export' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold block mb-2">⬇️ Download</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              { label: '1080p MP4', badge: 'PRO', color: '#7b2fff', icon: '🎬', action: () => alert('Upgrade to Pro to export 1080p video.') },
                              { label: '720p MP4', badge: 'FREE', color: '#00c8ff', icon: '📹', action: () => alert('Video rendering coming in the full build.') },
                              { label: 'Script (.txt)', badge: 'FREE', color: '#00c8ff', icon: '📄', action: downloadScript },
                              { label: 'Thumbnail PNG', badge: 'FREE', color: '#00c8ff', icon: '🖼️', action: () => setActiveEditorTab('thumbnail') },
                            ].map(opt => (
                              <button key={opt.label} onClick={opt.action}
                                className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl transition-all text-left">
                                <span>{opt.icon}</span>
                                <span className="text-xs font-semibold flex-1">{opt.label}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${opt.color}20`, color: opt.color }}>{opt.badge}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-bold text-white flex items-center gap-2">▶ Upload to YouTube</p>
                              <p className="text-xs text-gray-500">Publish directly to your channel</p>
                            </div>
                            <button onClick={() => setUploadToYT(!uploadToYT)}
                              className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${uploadToYT ? 'bg-[#00c8ff]' : 'bg-white/10'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${uploadToYT ? 'left-7' : 'left-1'}`} />
                            </button>
                          </div>
                          {uploadToYT && (
                            <div className="space-y-3 animate-slide-in">
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                                <input value={ytTitle} onChange={e => setYtTitle(e.target.value.slice(0, 100))}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                                <textarea value={ytDesc} onChange={e => setYtDesc(e.target.value)} rows={3}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Hashtags</label>
                                <input value={ytHashtags} onChange={e => setYtHashtags(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-400 mb-1 block">Visibility</label>
                                  <div className="flex gap-1.5">
                                    {(['public', 'unlisted', 'private'] as const).map(v => (
                                      <button key={v} onClick={() => setYtVisibility(v)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${ytVisibility === v ? 'border-[#00c8ff] bg-[#00c8ff]/10 text-[#00c8ff]' : 'border-white/10 text-gray-400'}`}>
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                                  <select value={ytCategory} onChange={e => setYtCategory(e.target.value)}
                                    className="w-full bg-[#050d1a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none">
                                    {['Education', 'Entertainment', 'Music', 'Comedy', 'Gaming', 'Sports', 'Science & Technology', 'News & Politics'].map(c => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <button onClick={() => alert('Connect your YouTube channel in Settings to enable direct upload.')}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-sm hover:opacity-90 transition-all">
                                ▶ Upload to YouTube
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

        {/* INSPIRE TAB */}
        {activeTab === 'inspire' && <VideoWall onUsePrompt={handleUsePrompt} />}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">My Shorts</h2>
                <p className="text-gray-400 text-xs mt-0.5">{savedShorts.length} generated this session</p>
              </div>
              <button onClick={() => setActiveTab('create')}
                className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-bold px-4 py-2 rounded-full text-xs">
                + New Short
              </button>
            </div>

            {savedShorts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-gray-400 font-semibold mb-2">No Shorts yet</p>
                <p className="text-gray-600 text-sm mb-6">Generate your first Short to see it here</p>
                <button onClick={() => setActiveTab('create')}
                  className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-6 py-3 rounded-2xl text-sm hover:opacity-90 transition-all">
                  ⚡ Generate My First Short
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {savedShorts.map(s => (
                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-16 rounded-lg bg-gradient-to-b from-[#00c8ff]/20 to-[#7b2fff]/20 border border-white/10 flex items-center justify-center shrink-0 text-xl">🎬</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{s.title}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                            <span className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{s.style}</span>
                            <span>Score: <span className="font-bold" style={{ color: s.score >= 90 ? '#00ff88' : s.score >= 75 ? '#00c8ff' : '#ffaa00' }}>{s.score}</span></span>
                            <span>{s.date}</span>
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <button onClick={() => { setScript(s.script); setGeneratedScript(s.script); setDone(true); setIdea(s.title); setViralScore(s.score); setActiveTab('create') }}
                              className="text-xs text-[#00c8ff] border border-[#00c8ff]/30 px-2.5 py-1 rounded-full hover:bg-[#00c8ff]/10 transition-all">
                              ✏️ Edit
                            </button>
                            <button onClick={downloadScript}
                              className="text-xs text-gray-400 border border-white/10 px-2.5 py-1 rounded-full hover:text-white transition-all">
                              ⬇️ Script
                            </button>
                            {s.status === 'Draft' && (
                              <button onClick={() => markAsPublished(s.id)}
                                className="text-xs text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full hover:bg-green-500/10 transition-all">
                                ✓ Publish
                              </button>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${s.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-[#00c8ff]">{savedShorts.length}</div>
                    <div className="text-xs text-gray-400 mt-1">Generated</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-green-400">{savedShorts.filter(s => s.status === 'Published').length}</div>
                    <div className="text-xs text-gray-400 mt-1">Published</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-[#7b2fff]">
                      {savedShorts.length > 0 ? Math.round(savedShorts.reduce((a, s) => a + s.score, 0) / savedShorts.length) : 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Avg Score</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* MAGIC BOX */}
      {done && (
        <div className="fixed bottom-6 right-4 sm:bottom-6 sm:left-4 sm:right-auto z-40">
          {magicOpen && (
            <div className="mb-3 bg-[#080f1e] border border-[#7b2fff]/50 rounded-2xl p-4 shadow-2xl w-[calc(100vw-2rem)] max-w-xs sm:w-80"
              style={{ boxShadow: '0 0 40px rgba(123,47,255,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🪄</span>
                <span className="font-black text-sm">Magic Box</span>
                <button onClick={() => { setMagicOpen(false); setMagicResult('') }} className="ml-auto text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <p className="text-xs text-gray-500 mb-3">Type any instruction — AI rewrites your script instantly</p>
              <div className="flex gap-2 mb-3">
                <input value={magicCommand} onChange={e => setMagicCommand(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMagicCommand()}
                  placeholder='"make the hook more dramatic"'
                  autoFocus
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#7b2fff]/50 transition-colors" />
                <button onClick={handleMagicCommand} disabled={magicLoading || !magicCommand.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-white text-sm disabled:opacity-40">
                  {magicLoading ? '⏳' : '→'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['Make hook dramatic', 'Shorter script', 'Add strong CTA', 'More emotional', 'Increase suspense', 'Better title'].map(cmd => (
                  <button key={cmd} onClick={() => setMagicCommand(cmd)}
                    className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 hover:border-[#7b2fff]/50 text-gray-400 transition-all">
                    {cmd}
                  </button>
                ))}
              </div>
              {magicLoading && (
                <div className="flex items-center gap-2 text-xs text-[#7b2fff] py-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Rewriting with AI...
                </div>
              )}
              {magicResult && !magicLoading && (
                <div className="bg-[#7b2fff]/10 border border-[#7b2fff]/30 rounded-xl p-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7b2fff] font-bold">✨ Rewritten</span>
                    <button onClick={() => setMagicResult('')} className="text-gray-500 hover:text-white text-xs">✕</button>
                  </div>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{magicResult}</p>
                  <button onClick={() => { setScript(magicResult); setMagicOpen(false); setMagicResult(''); setMagicCommand('') }}
                    className="w-full mt-2 bg-[#7b2fff] text-white font-bold text-xs py-2 rounded-lg hover:bg-[#6a1fe0] transition-all">
                    ✓ Apply to Script
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setMagicOpen(!magicOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-xl ${magicOpen ? 'bg-[#7b2fff]' : 'bg-gradient-to-br from-[#7b2fff] to-[#00c8ff]'}`}
            style={{ boxShadow: '0 0 30px rgba(123,47,255,0.5)' }}>
            🪄
          </button>
        </div>
      )}
    </div>
  )
}