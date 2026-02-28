const features = [
  { icon: "✍️", title: "AI Script Writing", desc: "Viral-optimized scripts with a 3-second hook, storytelling arc, and strong CTA — every time." },
  { icon: "🎙️", title: "Natural Voiceover", desc: "Choose from 20+ AI voices or clone your own. Sounds human, not robotic." },
  { icon: "🎬", title: "Cinematic Visuals", desc: "AI-generated video clips matched to every sentence of your script. No stock footage needed." },
  { icon: "💬", title: "Auto Captions", desc: "Word-by-word animated captions in TikTok style, perfectly synced to the voiceover." },
  { icon: "🎵", title: "AI Music Scoring", desc: "Background music generated to match your video's mood. Auto-mixed so your voice stays clear." },
  { icon: "🚀", title: "YouTube Auto-Upload", desc: "Publishes directly to your channel with AI-written title, description, and tags." },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[#7b2fff] text-sm font-semibold tracking-[4px] uppercase mb-4">Everything Included</p>
          <h2 className="text-5xl font-black mb-6">One prompt.<br />Six AI engines.</h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto">Every step of the production pipeline runs automatically — no plugins, no editing, no learning curve.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#7b2fff]/40 transition-all hover:-translate-y-1 group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}