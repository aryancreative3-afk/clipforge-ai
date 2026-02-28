export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'Type Your Idea', desc: 'Enter any topic or concept. Our AI understands context, tone, and what makes Shorts go viral.', icon: '💡' },
    { num: '02', title: 'AI Builds Everything', desc: 'Script, voiceover, visuals, captions, and music are generated and assembled automatically in minutes.', icon: '⚡' },
    { num: '03', title: 'Review & Publish', desc: 'Preview your Short, make any tweaks, then hit publish. ClipForge uploads directly to your YouTube channel.', icon: '🚀' },
  ]

  return (
    <section id="how" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">The Process</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">From idea to published</h2>
          <p className="text-gray-400 text-xl">in under 10 minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
              <div className="text-5xl font-black text-white/5 absolute top-4 right-6">{step.num}</div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-black mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}