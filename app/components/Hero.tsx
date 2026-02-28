export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00c8ff]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7b2fff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-[#00c8ff] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse" />
          Now in Beta — First 3 Shorts completely free
        </div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-[1.05]">
          Type an idea.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c8ff] to-[#7b2fff]">
            Get a cinematic Short.
          </span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl mb-10 leading-relaxed max-w-2xl mx-auto">
          ClipForge AI writes the script, records the voice, generates visuals,
          adds captions, scores the music — and uploads to YouTube automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href="/dashboard" className="bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 inline-block">
  Start Creating Free →
</a>
          <button className="border border-white/20 hover:border-white/40 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all">
            Watch Demo
          </button>
        </div>
        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
          <span>✓ No editing skills needed</span>
          <span>✓ No software required</span>
          <span>✓ Auto-uploads to YouTube</span>
        </div>
      </div>
    </section>
  )
}