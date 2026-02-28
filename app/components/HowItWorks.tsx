const steps = [
  { num: "01", title: "Type Your Idea", desc: "Enter any topic or concept. Our AI understands context, tone, and what makes Shorts go viral." },
  { num: "02", title: "AI Builds Everything", desc: "Script, voiceover, visuals, captions, and music are generated and assembled automatically in minutes." },
  { num: "03", title: "Review & Publish", desc: "Preview your Short, make any tweaks, then hit publish. ClipForge uploads directly to your YouTube channel." },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">The Process</p>
          <h2 className="text-5xl font-black mb-4">From idea to published</h2>
          <p className="text-gray-400 text-xl">in under 10 minutes</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-[#00c8ff]/40 transition-all hover:-translate-y-1">
              <div className="text-6xl font-black text-[#00c8ff]/20 mb-4">{step.num}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}