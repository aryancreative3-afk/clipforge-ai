const plans = [
  {
    name: "Spark",
    price: "Free",
    desc: "Try it out",
    features: ["3 Shorts per month", "Watermarked", "Standard voices", "720p export"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$19",
    desc: "per month",
    features: ["20 Shorts per month", "No watermark", "5 voice options", "1080p export", "YouTube auto-upload", "Caption styles"],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$49",
    desc: "per month",
    features: ["Unlimited Shorts", "All voices + voice cloning", "Cinematic video styles", "Priority rendering", "Analytics dashboard", "Thumbnail generation"],
    cta: "Go Pro",
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">Pricing</p>
          <h2 className="text-5xl font-black mb-6">Simple, honest pricing</h2>
          <p className="text-gray-400 text-xl">Start free. Scale when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div key={plan.name} className={`p-8 rounded-2xl border transition-all ${plan.highlight ? 'border-[#00c8ff] bg-gradient-to-b from-[#00c8ff]/10 to-transparent scale-105' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
              {plan.highlight && (
                <div className="text-xs font-bold text-black bg-[#00c8ff] rounded-full px-3 py-1 inline-block mb-4">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-gray-400 mb-2">{plan.desc}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-[#00c8ff]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-bold transition-all ${plan.highlight ? 'bg-[#00c8ff] text-black hover:bg-[#00a8dd]' : 'border border-white/20 hover:border-white/40'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}