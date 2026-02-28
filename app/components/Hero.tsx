export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#7b2fff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#00c8ff]/30 bg-[#00c8ff]/10 rounded-full px-4 py-2 text-sm text-[#00c8ff] font-semibold mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse" />
          Now in Beta — First 3 Shorts completely free
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
          Type an idea.
          <br />
          <span className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] bg-clip-text text-transparent">
            Get a cinematic Short.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          ClipForge AI writes the script, records the voice, generates visuals, adds captions, scores the music — and uploads to YouTube automatically.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href="/signup" className="bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-black px-10 py-4 rounded-full text-lg transition-all hover:scale-105 inline-block text-center">
            Start Creating Free →
          </a>
          <a href="#how" className="border border-white/20 hover:border-white/40 text-white font-bold px-10 py-4 rounded-full text-lg transition-all inline-block text-center">
            Watch Demo
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2"><span className="text-green-400">✓</span> No editing skills needed</span>
          <span className="flex items-center gap-2"><span className="text-green-400">✓</span> No software required</span>
          <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Auto-uploads to YouTube</span>
        </div>
      </div>
    </section>
  )
}