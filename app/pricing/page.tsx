'use client'
import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Spark',
    price: { monthly: 'Free', yearly: 'Free' },
    desc: 'Try ClipForge risk-free',
    color: '#ffffff',
    features: [
      '3 Shorts per month',
      'Watermarked output',
      'Standard AI voices',
      '720p export quality',
      'Basic caption styles',
    ],
    missing: ['YouTube auto-upload', 'Voice cloning', 'Analytics', 'Priority rendering'],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    name: 'Starter',
    price: { monthly: '$19', yearly: '$15' },
    desc: 'For serious solo creators',
    color: '#00c8ff',
    features: [
      '20 Shorts per month',
      'No watermark',
      '5 AI voice options',
      '1080p export quality',
      'YouTube auto-upload',
      'All caption styles',
      'Email support',
    ],
    missing: ['Voice cloning', 'Priority rendering'],
    cta: 'Start Starter Plan',
    ctaLink: '/signup',
    highlight: true,
  },
  {
    name: 'Pro',
    price: { monthly: '$49', yearly: '$39' },
    desc: 'Unlimited creative power',
    color: '#7b2fff',
    features: [
      'Unlimited Shorts',
      'No watermark',
      'All voices + voice cloning',
      '1080p export quality',
      'YouTube auto-upload',
      'Priority rendering',
      'Analytics dashboard',
      'Thumbnail generation',
      'Priority support',
    ],
    missing: [],
    cta: 'Go Pro',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    name: 'Agency',
    price: { monthly: '$149', yearly: '$119' },
    desc: 'For teams & agencies',
    color: '#ff6b35',
    features: [
      'Everything in Pro',
      '5 YouTube channels',
      'Team seats (5 users)',
      'White-label watermark',
      'Bulk scheduling',
      'API access',
      'Dedicated account manager',
    ],
    missing: [],
    cta: 'Contact Sales',
    ctaLink: '/signup',
    highlight: false,
  },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel with one click, no questions asked. You keep access until the end of your billing period.' },
  { q: 'What happens when I run out of Shorts?', a: 'You can upgrade your plan anytime, or wait for your monthly credits to reset on your billing date.' },
  { q: 'Is the AI voice really that good?', a: 'Yes. We use ElevenLabs — the industry leader in AI voice generation. Most viewers cannot tell it apart from a human voice.' },
  { q: 'Do I need a YouTube channel?', a: 'No — you can download the MP4 and upload anywhere. YouTube auto-upload is optional and requires connecting your channel in Settings.' },
  { q: 'What is voice cloning?', a: 'Upload a 1-minute audio sample of your voice and ClipForge will generate Shorts that sound exactly like you — not a generic AI.' },
  { q: 'Can I try before paying?', a: 'Absolutely. The Free plan gives you 3 complete Shorts with no credit card required. See the quality for yourself first.' },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#050d1a]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">C</div>
            <span className="font-black text-xl">ClipForge AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-bold px-5 py-2 rounded-full transition-all">Get Started Free</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#00c8ff] text-sm font-semibold tracking-[4px] uppercase mb-4">Pricing</p>
          <h1 className="text-6xl font-black mb-6">Simple, honest pricing</h1>
          <p className="text-gray-400 text-xl mb-10">Start free. Scale when you're ready. Cancel anytime.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-1">
            <button onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${!yearly ? 'bg-white text-black' : 'text-gray-400'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${yearly ? 'bg-white text-black' : 'text-gray-400'}`}>
              Yearly
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {plans.map(plan => (
            <div key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:-translate-y-1 ${plan.highlight ? 'border-[#00c8ff] bg-gradient-to-b from-[#00c8ff]/10 to-transparent' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c8ff] text-black text-xs font-black px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-black mb-1" style={{ color: plan.color }}>{plan.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black">{yearly ? plan.price.yearly : plan.price.monthly}</span>
                  {plan.price.monthly !== 'Free' && <span className="text-gray-400 mb-2">/mo</span>}
                </div>
                {yearly && plan.price.monthly !== 'Free' && (
                  <p className="text-green-400 text-xs mt-1 font-semibold">Billed yearly · Save 20%</p>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 shrink-0" style={{ color: plan.color }}>✓</span> {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 shrink-0">✕</span> {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaLink}
                className={`w-full py-3 rounded-xl font-bold text-center text-sm transition-all block ${plan.highlight ? 'bg-[#00c8ff] text-black hover:bg-[#00a8dd]' : 'border border-white/20 hover:border-white/40 text-white'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-center mb-12">Everything compared</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { feature: 'Shorts per month', spark: '3', starter: '20', pro: 'Unlimited', agency: 'Unlimited' },
              { feature: 'Export quality', spark: '720p', starter: '1080p', pro: '1080p', agency: '1080p' },
              { feature: 'Watermark', spark: 'Yes', starter: 'No', pro: 'No', agency: 'Custom' },
              { feature: 'AI voices', spark: '2', starter: '5', pro: 'All 20+', agency: 'All 20+' },
              { feature: 'Voice cloning', spark: '✕', starter: '✕', pro: '✓', agency: '✓' },
              { feature: 'YouTube upload', spark: '✕', starter: '✓', pro: '✓', agency: '✓' },
              { feature: 'Analytics', spark: '✕', starter: '✕', pro: '✓', agency: '✓' },
              { feature: 'API access', spark: '✕', starter: '✕', pro: '✕', agency: '✓' },
              { feature: 'Team seats', spark: '1', starter: '1', pro: '1', agency: '5' },
            ].map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <div className="px-4 py-3 text-sm text-gray-400 font-medium border-r border-white/10">{row.feature}</div>
                {[row.spark, row.starter, row.pro, row.agency].map((val, j) => (
                  <div key={j} className={`px-4 py-3 text-sm text-center font-semibold ${val === '✕' ? 'text-gray-600' : val === '✓' ? 'text-green-400' : 'text-white'} ${j === 1 ? 'bg-[#00c8ff]/5' : ''}`}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-5 border-t border-white/10">
              <div className="px-4 py-4" />
              {['Free', '$19/mo', '$49/mo', '$149/mo'].map((price, i) => (
                <div key={i} className={`px-4 py-4 text-center ${i === 1 ? 'bg-[#00c8ff]/5' : ''}`}>
                  <Link href="/signup" className={`text-xs font-bold px-4 py-2 rounded-full transition-all inline-block ${i === 1 ? 'bg-[#00c8ff] text-black' : 'border border-white/20 hover:border-white/40'}`}>
                    {price}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-center mb-12">Frequently asked</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <span className="text-gray-400 ml-4">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#00c8ff]/10 to-[#7b2fff]/10 border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-black mb-4">Ready to start creating?</h2>
            <p className="text-gray-400 text-lg mb-8">Join thousands of creators publishing cinematic Shorts every day.</p>
            <Link href="/signup"
              className="inline-block bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-12 py-5 rounded-full text-xl hover:opacity-90 transition-all hover:scale-105">
              Start Free — No Credit Card
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}