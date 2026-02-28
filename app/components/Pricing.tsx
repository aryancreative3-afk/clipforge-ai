import Link from 'next/link'

export default function Pricing() {
  const plans = [
    { name: 'Spark', price: 'Free', color: '#ffffff', features: ['3 Shorts/month', 'Watermarked', '720p quality', 'Basic voices'], cta: 'Get Started', highlight: false },
    { name: 'Starter', price: '$19/mo', color: '#00c8ff', features: ['20 Shorts/month', 'No watermark', '1080p quality', 'YouTube upload'], cta: 'Start Free Trial', highlight: true },
    { name: 'Pro', price: '$49/mo', color: '#7b2fff', features: ['Unlimited Shorts', 'Voice cloning', 'Priority rendering', 'Analytics'], cta: 'Go Pro', highlight: false },
  ]

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Simple, honest pricing</h2>
          <p className="text-gray-400 text-xl">Start free. Scale when ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[#00c8ff] bg-gradient-to-b from-[#00c8ff]/10 to-transparent' : 'border-white/10 bg-white/5'}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c8ff] text-black text-xs font-black px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-black mb-2" style={{ color: plan.color }}>{plan.name}</h3>
              <div className="text-4xl font-black mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span style={{ color: plan.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className={`w-full py-3 rounded-xl font-bold text-center text-sm transition-all block ${plan.highlight ? 'bg-[#00c8ff] text-black hover:bg-[#00a8dd]' : 'border border-white/20 hover:border-white/40 text-white'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/pricing" className="text-[#00c8ff] hover:underline text-sm font-semibold">
            See full pricing comparison →
          </Link>
        </div>
      </div>
    </section>
  )
}