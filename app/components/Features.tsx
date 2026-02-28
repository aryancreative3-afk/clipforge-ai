export default function Features() {
  const features = [
    { icon: '✍️', title: 'AI Script Writing', desc: 'Viral-optimized scripts with a 3-second hook, storytelling arc, and strong CTA — every time.' },
    { icon: '🎙️', title: 'Natural Voiceover', desc: 'Choose from 20+ AI voices or clone your own. Sounds human, not robotic.' },
    { icon: '🎬', title: 'Cinematic Visuals', desc: 'AI-generated B-roll and stock footage matched perfectly to your script.' },
    { icon: '💬', title: 'Auto Captions', desc: 'Word-by-word animated captions in any color, size, or style. TikTok-ready.' },
    { icon: '🎵', title: 'Music Scoring', desc: 'Background music auto-composed and mixed to match your video mood.' },
    { icon: '📺', title: 'YouTube Upload', desc: 'One click to publish directly to your channel with title, tags, and description.' },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">Everything Included</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">One prompt. Six AI engines.</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">Every step of the production pipeline runs automatically — no plugins, no editing, no learning curve.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-black mb-2">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}