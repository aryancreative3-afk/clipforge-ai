'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── TYPES ──────────────────────────────────────────────────────────
interface TestimonialType {
  quote: string
  name: string
  handle: string
  role: string
  avatar: string
  stats: string
}

interface VideoCardType {
  title: string
  emoji: string
  gradient: string
  views: string
  score: number
}

// ── DATA ───────────────────────────────────────────────────────────
const testimonials: TestimonialType[] = [
  { quote: "I went from 0 to 47K subscribers in 6 weeks. ClipForge writes, voices, and edits — I just hit generate.", name: "Marcus Bell", handle: "@marcusbuilds", role: "Tech Creator", avatar: "M", stats: "47K subs in 6 weeks" },
  { quote: "My agency produces 30 Shorts a day for clients. What used to take a team of 5 now takes one person and ClipForge.", name: "Priya Sharma", handle: "@priyacreates", role: "Agency Owner", avatar: "P", stats: "30 Shorts/day" },
  { quote: "The AI understands virality. Every Short it makes hooks in the first 2 seconds. My views tripled in a month.", name: "Jordan West", handle: "@jordanwest.ai", role: "Motivational Creator", avatar: "J", stats: "3× views in 30 days" },
  { quote: "Finally an AI tool that doesn't produce generic garbage. The cinematic style is legitimately cinematic.", name: "Sofia Chen", handle: "@sofiafilms", role: "Filmmaker", avatar: "S", stats: "2.1M total views" },
  { quote: "I don't speak English natively. ClipForge generates in my language, with my accent. Game changer for global creators.", name: "Ahmed Al-Rashid", handle: "@ahmedcreates", role: "Arabic Creator", avatar: "A", stats: "12 languages used" },
  { quote: "The viral score is scarily accurate. Every Short above 90 has gone over 100K views. Every single one.", name: "Taylor Brooks", handle: "@taylorshorts", role: "Full-time Creator", avatar: "T", stats: "100K+ per Short" },
]

const wallVideos: VideoCardType[] = [
  { title: "Why We Never Returned to the Moon", emoji: "🌙", gradient: "from-indigo-900 to-purple-950", views: "2.3M", score: 97 },
  { title: "No One Is Coming to Save You", emoji: "🔥", gradient: "from-red-900 to-orange-950", views: "4.2M", score: 98 },
  { title: "The Last Astronaut", emoji: "🚀", gradient: "from-blue-950 to-indigo-950", views: "5.1M", score: 99 },
  { title: "5 Signs You're Meant to Be Rich", emoji: "💰", gradient: "from-yellow-900 to-orange-950", views: "1.8M", score: 94 },
  { title: "How Black Holes Actually Work", emoji: "🕳️", gradient: "from-violet-950 to-black", views: "1.5M", score: 95 },
  { title: "Tesla's Secret Edison Buried", emoji: "⚡", gradient: "from-blue-900 to-cyan-950", views: "2.7M", score: 96 },
  { title: "The Day I Quit My $200K Job", emoji: "💼", gradient: "from-rose-900 to-red-950", views: "4.8M", score: 96 },
  { title: "Why Japan Never Has Crime", emoji: "🇯🇵", gradient: "from-red-900 to-pink-950", views: "3.1M", score: 93 },
]

const features = [
  { icon: "✍️", title: "AI Script Writer", desc: "Hook-first scripts engineered for virality. Every word optimized to keep viewers watching." },
  { icon: "🎙️", title: "Voice Cloning", desc: "6 AI voices across 12 languages with accent control. Sound like a pro narrator instantly." },
  { icon: "🎬", title: "Auto Visuals", desc: "AI selects and syncs cinematic stock footage to match every beat of your script." },
  { icon: "💬", title: "Smart Captions", desc: "Word-by-word animated captions that appear at exactly the right moment." },
  { icon: "⚡", title: "Viral Score", desc: "Proprietary AI scores your Short 0–100 before you publish. Only post winners." },
  { icon: "🚀", title: "1-Click Upload", desc: "Push directly to YouTube with auto-generated titles, descriptions, tags, and hashtags." },
]

const plans = [
  {
    name: "Starter",
    tagline: "Perfect for getting started",
    price: "0",
    annualPrice: "0",
    period: "forever",
    accentColor: "#ffffff",
    borderColor: "border-white/10",
    badge: null,
    badgeStyle: "",
    highlight: false,
    savings: null,
    compare: "vs InVideo Plus $28/mo",
    features: [
      { icon: "🎬", text: "3 Shorts per month" },
      { icon: "📹", text: "720p export" },
      { icon: "🎙️", text: "5 AI voice styles" },
      { icon: "💬", text: "Basic captions" },
      { icon: "📸", text: "Pexels stock library" },
      { icon: "⚡", text: "Viral score analysis" },
    ],
    cta: "Start for Free",
    ctaClass: "border border-white/20 text-white hover:bg-white/5",
  },
  {
    name: "Creator",
    tagline: "Best for solo creators",
    price: "25",
    annualPrice: "15",
    period: "per month",
    accentColor: "#00c8ff",
    borderColor: "border-[#00c8ff]",
    badge: "Most Popular",
    badgeStyle: "bg-[#00c8ff] text-black",
    highlight: false,
    savings: "Save $120/yr",
    compare: "vs InVideo Plus $28/mo",
    features: [
      { icon: "🎬", text: "30 Shorts per month" },
      { icon: "📹", text: "1080p export, no watermark" },
      { icon: "🎙️", text: "All 6 voices + accent control" },
      { icon: "💬", text: "Word-by-word animated captions" },
      { icon: "🌍", text: "12 languages supported" },
      { icon: "🚀", text: "1-click YouTube upload" },
      { icon: "🪄", text: "Magic Box AI editor" },
      { icon: "🎨", text: "Brand kit" },
    ],
    cta: "Start 7-Day Free Trial",
    ctaClass: "bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black hover:opacity-90",
  },
  {
    name: "Pro",
    tagline: "Best for serious creators",
    price: "79",
    annualPrice: "47",
    period: "per month",
    accentColor: "#7b2fff",
    borderColor: "border-[#7b2fff]",
    badge: "Best Value",
    badgeStyle: "bg-[#7b2fff] text-white",
    highlight: true,
    savings: "Save $384/yr",
    compare: "vs InVideo Generative $100/mo",
    features: [
      { icon: "✅", text: "Everything in Creator" },
      { icon: "🎬", text: "100 Shorts per month" },
      { icon: "🗣️", text: "Voice cloning (your voice)" },
      { icon: "🔬", text: "Advanced viral score + analytics" },
      { icon: "🎵", text: "AI background music library" },
      { icon: "📱", text: "TikTok & Instagram export presets" },
      { icon: "🖼️", text: "AI thumbnail generator" },
      { icon: "⚡", text: "Priority rendering queue" },
    ],
    cta: "Start 7-Day Free Trial",
    ctaClass: "bg-gradient-to-r from-[#7b2fff] to-[#ff6b35] text-white font-black hover:opacity-90",
  },
  {
    name: "Team",
    tagline: "Best for agencies & teams",
    price: "499",
    annualPrice: "299",
    period: "per month",
    accentColor: "#ff6b35",
    borderColor: "border-[#ff6b35]/60",
    badge: null,
    badgeStyle: "",
    highlight: false,
    savings: "Save $2,400/yr",
    compare: "vs InVideo Team $899/mo",
    features: [
      { icon: "✅", text: "Everything in Pro" },
      { icon: "🎬", text: "300 Shorts per month" },
      { icon: "👥", text: "10 team seats included" },
      { icon: "🏷️", text: "White-label exports" },
      { icon: "🔑", text: "API access" },
      { icon: "🗣️", text: "Custom brand voices (×5)" },
      { icon: "📊", text: "Team analytics dashboard" },
      { icon: "💬", text: "Dedicated Slack support" },
    ],
    cta: "Start 7-Day Free Trial",
    ctaClass: "bg-gradient-to-r from-[#ff6b35] to-[#ff3366] text-white font-black hover:opacity-90",
  },
]

// ── FAQ DATA ───────────────────────────────────────────────────────
const faqs = [
  {
    q: "Does YouTube monetize AI-generated Shorts?",
    a: "Yes — YouTube can monetize AI-generated Shorts as long as they meet YouTube's Partner Program requirements: original content, no policy violations, and genuine viewer engagement. Thousands of ClipForge creators are already earning ad revenue. Always stay updated with YouTube's latest monetization guidelines as policies can evolve.",
  },
  {
    q: "How long does it take to generate a Short?",
    a: "Most Shorts are fully generated in under 60 seconds. The AI writes the script, selects a voice, syncs stock footage, adds animated captions, scores for virality, and assembles everything automatically. You can then edit anything in the editor before exporting.",
  },
  {
    q: "What languages and accents are supported?",
    a: "ClipForge supports 12 languages including English, Hindi, Spanish, French, German, Portuguese, Japanese, Korean, Arabic, Chinese, Russian, and Italian. Each language has multiple accent options — for example English supports American, British, Indian, Australian, Canadian, and Irish accents.",
  },
  {
    q: "Can I use my own voice instead of AI voices?",
    a: "Yes — on the Pro and Agency plans you can upload a voice sample and ClipForge will clone your voice for all future Shorts. This means every video sounds authentically like you, even if you never record again.",
  },
  {
    q: "What stock footage library does ClipForge use?",
    a: "ClipForge integrates with Pexels, giving you access to millions of free high-quality photos and videos. The AI automatically selects footage that matches your script's mood and topic. You can also search and swap any clip manually in the Media tab.",
  },
  {
    q: "What is the Viral Score and how accurate is it?",
    a: "The Viral Score (0–100) is our proprietary AI metric that analyses your Short's hook strength, pacing, caption timing, and retention patterns against thousands of high-performing Shorts. Creators report that Shorts scoring above 90 consistently hit 100K+ views. It's a prediction, not a guarantee — but it's a powerful signal before you publish.",
  },
]

// ── BLOG DATA ──────────────────────────────────────────────────────
const blogPosts = [
  { emoji: "🚀", tag: "Growth", title: "How to Get Your First 10K YouTube Shorts Views", desc: "A step-by-step breakdown of the hook formula, posting cadence, and thumbnail strategy that took creators from 0 to viral.", readTime: "6 min read" },
  { emoji: "🤖", tag: "AI Tips", title: "How to Start a Faceless YouTube Channel with AI in 2026", desc: "You don't need a camera, microphone, or editing skills. Here's exactly how to build a monetized faceless channel using ClipForge.", readTime: "8 min read" },
  { emoji: "💰", tag: "Monetization", title: "Does YouTube Pay for AI-Generated Shorts? The Truth", desc: "We tested monetization on 50 AI-generated Shorts across 5 channels. Here's what we found about RPM, eligibility, and the future of AI content.", readTime: "5 min read" },
  { emoji: "🎬", tag: "Strategy", title: "The Perfect YouTube Short Structure (With Examples)", desc: "Hook, story, CTA — but the details matter enormously. We analysed 1,000 viral Shorts to find the exact timing and structure that drives watch-through.", readTime: "7 min read" },
  { emoji: "🌍", tag: "Languages", title: "How to Grow a Multi-Language YouTube Channel with AI", desc: "One idea, 12 languages, 12 audiences. Here's how creators are multiplying their reach by auto-translating Shorts without losing quality.", readTime: "4 min read" },
  { emoji: "📈", tag: "Analytics", title: "What the YouTube Shorts Algorithm Actually Rewards in 2026", desc: "Retention rate, swipe-away signals, and re-watches. We break down what the algorithm prioritises and how to optimise your Shorts for each signal.", readTime: "9 min read" },
]

// ── TRUST BADGE DATA ───────────────────────────────────────────────
const trustBadges = [
  { label: "Product Hunt", sublabel: "Product of the Month", icon: "🏆", color: "#ff6154" },
  { label: "Capterra", sublabel: "4.9 / 5.0 Rating", icon: "⭐", color: "#00c8ff" },
  { label: "G2", sublabel: "4.8 / 5.0 Rating", icon: "⭐", color: "#ff492c" },
  { label: "Trustpilot", sublabel: "Excellent · 4.8", icon: "✓", color: "#00b67a" },
]

// ── ANIMATED COUNTER ───────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = end / 60
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ── MINI VIDEO CARD ────────────────────────────────────────────────
function MiniCard({ video }: { video: VideoCardType }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl overflow-hidden shrink-0 cursor-pointer transition-transform duration-300 ${hovered ? 'scale-105' : 'scale-100'}`}
      style={{ width: 'clamp(90px, 22vw, 130px)', aspectRatio: '9/16' }}>
      <div className={`absolute inset-0 bg-gradient-to-b ${video.gradient}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl transition-all duration-300 ${hovered ? 'scale-125' : 'scale-100'}`}>{video.emoji}</span>
      </div>
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-1">
        <span className="text-[#00c8ff] text-[9px] font-black">⚡{video.score}</span>
      </div>
      <div className={`absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-80'}`}>
        <p className="text-white font-black text-[9px] leading-tight line-clamp-2">{video.title}</p>
        <p className="text-white/50 text-[8px] mt-0.5">👁 {video.views}</p>
      </div>
      <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${hovered ? 'border-[#00c8ff]/70' : 'border-white/10'}`} />
    </div>
  )
}

// ── FAQ ACCORDION ITEM ─────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${open ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <span className="font-mono-custom text-xs text-[#00c8ff]/60 shrink-0 w-6 text-right">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="flex-1 font-bold text-sm sm:text-base text-white leading-snug">{q}</p>
        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'border-[#00c8ff] bg-[#00c8ff]/20 rotate-45' : 'border-white/20'}`}>
          <span className="text-white text-lg leading-none mb-0.5">+</span>
        </div>
      </div>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-gray-400 text-sm leading-relaxed pl-16 sm:pl-20">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── BLOG CARD ──────────────────────────────────────────────────────
function BlogCard({ post }: { post: typeof blogPosts[0] }) {
  return (
    <a href="#" className="group flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300">
      {/* Graphic header */}
      <div className="h-36 sm:h-40 flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #050d1a 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 50%, #00c8ff33, transparent 60%), radial-gradient(circle at 70% 50%, #7b2fff33, transparent 60%)' }} />
        <span className="text-5xl sm:text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">{post.emoji}</span>
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 uppercase tracking-wider">
            {post.tag}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3 className="font-black text-sm sm:text-base text-white leading-snug mb-2 group-hover:text-[#00c8ff] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3">{post.desc}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span className="text-gray-600 text-xs">{post.readTime}</span>
          <span className="text-[#00c8ff] text-xs font-bold group-hover:translate-x-1 transition-transform duration-200">Read →</span>
        </div>
      </div>
    </a>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function LandingPage() {
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes slide-in { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.8s ease forwards; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .grain::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); background-size:200px; opacity:0.03; pointer-events:none; z-index:100; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <div className="grain" />

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#050d1a]/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center font-black text-sm shadow-lg shadow-[#00c8ff]/20">C</div>
            <span className="font-black text-xl tracking-tight">ClipForge <span className="text-[#00c8ff]">AI</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#wall" className="hover:text-white transition-colors">Examples</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Creators</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-4 py-2 rounded-full text-sm hover:opacity-90 transition-all shadow-lg shadow-[#00c8ff]/20">
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">

        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00c8ff] rounded-full opacity-5 blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7b2fff] rounded-full opacity-5 blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7b2fff] rounded-full opacity-3 blur-[160px] pointer-events-none" />

        {/* Rotating ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

        {/* Badge */}
        <div className="animate-slide-in mb-6" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300">Trusted by <span className="text-white font-black">12,400+</span> creators worldwide</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] leading-none mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <span className="block text-white">CREATE VIRAL</span>
            <span className="block bg-gradient-to-r from-[#00c8ff] via-[#7b2fff] to-[#ff6b35] bg-clip-text text-transparent">SHORTS IN</span>
            <span className="block text-white">60 SECONDS</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed animate-slide-in" style={{ animationDelay: '0.35s' }}>
            Type your idea. ClipForge writes the script, clones a voice, finds the footage, adds captions, scores it for virality — and exports to YouTube.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <Link href="/dashboard"
              className="group w-full sm:w-auto bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#00c8ff]/30 flex items-center justify-center gap-2">
              ⚡ Generate My First Short
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a href="#wall"
              className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              👁 See Examples
            </a>
          </div>

          <p className="text-gray-600 text-xs mt-4 animate-slide-in" style={{ animationDelay: '0.6s' }}>No credit card required · 3 free Shorts every month</p>
        </div>

        {/* Floating Short previews */}
        <div className="relative w-full max-w-4xl mx-auto mt-12 sm:mt-16 animate-slide-in px-2" style={{ animationDelay: '0.7s' }}>
          {/* Mobile: 3 cards */}
          <div className="flex sm:hidden justify-center items-end gap-3">
            {wallVideos.slice(1, 4).map((v, i) => (
              <div key={i}
                className="animate-float"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  transform: `translateY(${[-10, -24, -6][i]}px)`,
                  opacity: i === 0 || i === 2 ? 0.7 : 1,
                }}>
                <MiniCard video={v} />
              </div>
            ))}
          </div>
          {/* Desktop: 5 cards */}
          <div className="hidden sm:flex justify-center items-end gap-4">
            {wallVideos.slice(0, 5).map((v, i) => (
              <div key={i}
                className="animate-float"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  transform: `translateY(${[0, -20, -10, -24, -6][i]}px)`,
                  opacity: i === 0 || i === 4 ? 0.4 : i === 1 || i === 3 ? 0.7 : 1,
                }}>
                <MiniCard video={v} />
              </div>
            ))}
          </div>
          {/* Ground fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#050d1a] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="py-8 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 text-xs uppercase tracking-widest font-semibold mb-6">Trusted & rated by creators worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustBadges.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 font-black"
                  style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30` }}>
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-black text-xs truncate">{b.label}</div>
                  <div className="text-gray-500 text-[10px] truncate">{b.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-16 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: 12400, suffix: '+', label: 'Active Creators' },
            { value: 2800000, suffix: '+', label: 'Shorts Generated' },
            { value: 190, suffix: '+', label: 'Countries' },
            { value: 94, suffix: '%', label: 'Avg Viral Score' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-1">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00c8ff] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Everything Included</p>
            <h2 className="font-display text-5xl sm:text-7xl text-white">ONE TOOL.<br />FULL PIPELINE.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="group p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#00c8ff]/40 hover:bg-[#00c8ff]/5 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{f.icon}</div>
                <h3 className="font-black text-lg text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#7b2fff] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Dead Simple</p>
            <h2 className="font-display text-5xl sm:text-7xl text-white">HOW IT WORKS</h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#00c8ff] via-[#7b2fff] to-[#ff6b35] opacity-30" />

            <div className="space-y-6">
              {[
                { step: '01', icon: '💡', title: 'Type your idea', desc: 'Just describe your Short in plain English. "Why Tesla was misunderstood" or "5 habits of billionaires" — anything works.' },
                { step: '02', icon: '⚡', title: 'AI builds it in 60 seconds', desc: 'ClipForge writes the script, generates the voiceover, selects cinematic footage, and adds animated captions. All automatic.' },
                { step: '03', icon: '🎯', title: 'Check your viral score', desc: 'Every Short gets scored 0–100 before you publish. Our AI predicts performance based on hook strength, pacing, and retention patterns.' },
                { step: '04', icon: '🚀', title: 'Export or publish directly', desc: 'Download as 1080p MP4 or push directly to YouTube with auto-generated title, description, tags, and hashtags.' },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:border-[#00c8ff]/50 group-hover:bg-[#00c8ff]/5 transition-all">
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono-custom text-xs text-[#00c8ff] font-semibold">{step.step}</span>
                      <h3 className="font-black text-white text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO WALL ── */}
      <section id="wall" className="py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#ff6b35] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Real Results</p>
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-4">MADE WITH<br />CLIPFORGE</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">Every Short below was generated in under 60 seconds. Hover to see the prompt used.</p>
          </div>

          {/* Marquee row 1 */}
          <div className="relative mb-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050d1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050d1a] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-4 animate-marquee" style={{ width: 'max-content' }}>
              {[...wallVideos, ...wallVideos].map((v, i) => <MiniCard key={i} video={v} />)}
            </div>
          </div>

          {/* Marquee row 2 — reverse */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050d1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050d1a] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-4" style={{ animation: 'marquee 25s linear infinite reverse', width: 'max-content' }}>
              {[...wallVideos.slice().reverse(), ...wallVideos.slice().reverse()].map((v, i) => <MiniCard key={i} video={v} />)}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/dashboard?tab=inspire"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/5 transition-all">
              Browse all 48 examples in the Inspire tab →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00c8ff] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Creator Stories</p>
            <h2 className="font-display text-5xl sm:text-7xl text-white">REAL CREATORS.<br />REAL RESULTS.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i}
                className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-white/20 transition-all group">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, s) => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center font-black text-black">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.handle} · {t.role}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[#00c8ff] text-xs font-black">{t.stats}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#7b2fff] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Simple Pricing</p>
            <h2 className="font-display text-5xl sm:text-7xl text-white mb-4">NO SURPRISES.<br />JUST RESULTS.</h2>
            {/* Billing toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
                <button onClick={() => setBillingAnnual(false)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!billingAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>
                  Monthly
                </button>
                <button onClick={() => setBillingAnnual(true)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billingAnnual ? 'bg-white text-black' : 'text-gray-400'}`}>
                  Yearly
                  <span className="bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">-40%</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:items-start">
            {plans.map((plan, i) => (
              <div key={i} className={`relative flex flex-col rounded-2xl border-2 ${plan.borderColor} overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? 'shadow-2xl' : ''}`}
                style={plan.highlight ? { boxShadow: `0 0 40px ${plan.accentColor}20` } : {}}>

                {/* Highlight top bar */}
                {plan.highlight && (
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${plan.accentColor}, #ff6b35)` }} />
                )}

                {/* Badge ribbon */}
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${plan.badgeStyle}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`flex flex-col flex-1 p-5 ${plan.highlight ? 'bg-white/[0.05]' : 'bg-white/[0.02]'}`}>
                  {/* Header */}
                  <div className="mb-5">
                    <h3 className="font-black text-xl text-white">{plan.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl" style={{ color: plan.accentColor === '#ffffff' ? 'white' : plan.accentColor }}>
                        ${billingAnnual ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-gray-400 text-xs">/{plan.period}</span>
                    </div>
                    {billingAnnual && plan.savings && (
                      <p className="text-green-400 text-xs font-semibold mt-0.5">{plan.savings}</p>
                    )}
                    {!billingAnnual && plan.annualPrice !== '0' && (
                      <p className="text-gray-600 text-xs mt-0.5">or ${plan.annualPrice}/mo billed yearly</p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href="/dashboard"
                    className={`block text-center py-3 rounded-xl text-sm transition-all mb-5 ${plan.ctaClass}`}>
                    {plan.cta}
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-white/10 mb-4" />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <span className="text-sm shrink-0 mt-0.5">{f.icon}</span>
                        <span className="text-gray-300 text-xs leading-snug">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-gray-600 text-sm">All paid plans include a 7-day free trial. Cancel anytime.</p>
            <span className="hidden sm:block text-gray-700">·</span>
            <p className="text-gray-600 text-sm">Need something custom? <a href="#" className="text-[#00c8ff] hover:underline">Contact us →</a></p>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="py-24 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[#ff6b35] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">From the Blog</p>
              <h2 className="font-display text-4xl sm:text-6xl text-white leading-none">LEARN FROM<br />THE BEST</h2>
            </div>
            <a href="#" className="shrink-0 text-sm text-gray-400 border border-white/10 px-4 py-2 rounded-full hover:text-white hover:border-white/30 transition-all self-start sm:self-auto">
              All articles →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post, i) => (
              <BlogCard key={i} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#7b2fff] text-sm font-mono-custom font-semibold tracking-widest uppercase mb-3">Got Questions?</p>
            <h2 className="font-display text-4xl sm:text-6xl text-white">EVERYTHING<br />YOU NEED TO KNOW</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
          <div className="mt-10 p-5 bg-white/[0.02] border border-white/10 rounded-2xl text-center">
            <p className="text-gray-400 text-sm mb-3">Still have questions?</p>
            <a href="mailto:support@clipforge.ai"
              className="inline-flex items-center gap-2 text-[#00c8ff] font-bold text-sm border border-[#00c8ff]/30 px-5 py-2.5 rounded-full hover:bg-[#00c8ff]/10 transition-all">
              💬 Chat with support →
            </a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7b2fff]/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00c8ff] rounded-full opacity-5 blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-white mb-6">
            YOUR FIRST<br />
            <span className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] bg-clip-text text-transparent">VIRAL SHORT</span><br />
            STARTS NOW
          </h2>
          <p className="text-gray-400 text-lg mb-10">Join 12,400+ creators. No credit card required.</p>
          <Link href="/dashboard"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl hover:opacity-90 transition-all shadow-2xl shadow-[#00c8ff]/30">
            ⚡ Generate Free Short
            <span className="text-xl sm:text-2xl">→</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center font-black text-xs text-black">C</div>
                <span className="font-black text-lg">ClipForge <span className="text-[#00c8ff]">AI</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">The fastest way to create viral YouTube Shorts with AI.</p>
              <div className="flex gap-3">
                {['𝕏', 'in', '▶', '📸'].map((icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Dashboard', 'Inspire Wall', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Blog', 'Tutorials', 'Community', 'API Docs'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy Policy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, li) => (
                    <li key={li}>
                      <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2026 ClipForge AI. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}