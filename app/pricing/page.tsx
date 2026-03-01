'use client'
import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Spark',
    tagline: 'Try ClipForge free',
    monthlyINR: 0,
    yearlyINR: 0,
    monthlyUSD: 'Free',
    color: '#ffffff',
    gradient: 'from-gray-600 to-gray-400',
    features: [
      { text: '3 Shorts per month', included: true },
      { text: 'Watermarked output', included: true },
      { text: '720p export quality', included: true },
      { text: '2 AI voice options', included: true },
      { text: 'Basic caption styles', included: true },
      { text: 'YouTube auto-upload', included: false },
      { text: 'Voice cloning', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Priority rendering', included: false },
    ],
    cta: 'Start Free',
    ctaLink: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Starter',
    tagline: 'For serious creators',
    monthlyINR: 1599,
    yearlyINR: 1279,
    monthlyUSD: '$19',
    color: '#00c8ff',
    gradient: 'from-[#00c8ff] to-[#0099cc]',
    features: [
      { text: '20 Shorts per month', included: true },
      { text: 'No watermark', included: true },
      { text: '1080p export quality', included: true },
      { text: '5 AI voice options', included: true },
      { text: 'All caption styles', included: true },
      { text: 'YouTube auto-upload', included: true },
      { text: 'Email support', included: true },
      { text: 'Voice cloning', included: false },
      { text: 'Analytics dashboard', included: false },
    ],
    cta: 'Get Starter',
    ctaLink: null,
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Pro',
    tagline: 'Unlimited creative power',
    monthlyINR: 4099,
    yearlyINR: 3279,
    monthlyUSD: '$49',
    color: '#7b2fff',
    gradient: 'from-[#7b2fff] to-[#5a1fd4]',
    features: [
      { text: 'Unlimited Shorts', included: true },
      { text: 'No watermark', included: true },
      { text: '1080p export quality', included: true },
      { text: 'All 20+ AI voices', included: true },
      { text: 'All caption styles', included: true },
      { text: 'YouTube auto-upload', included: true },
      { text: 'Voice cloning', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Priority rendering', included: true },
    ],
    cta: 'Go Pro',
    ctaLink: null,
    highlight: false,
    badge: 'BEST VALUE',
  },
  {
    name: 'Agency',
    tagline: 'For teams & agencies',
    monthlyINR: 12499,
    yearlyINR: 9999,
    monthlyUSD: '$149',
    color: '#ff6b35',
    gradient: 'from-[#ff6b35] to-[#e84d1c]',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: '5 YouTube channels', included: true },
      { text: '5 team seats', included: true },
      { text: 'White-label output', included: true },
      { text: 'Bulk scheduling', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated manager', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
    ctaLink: null,
    highlight: false,
    badge: null,
  },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel with one click, no questions asked. You keep access until the end of your billing period.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, net banking, wallets, and EMI through Razorpay. International cards are also supported.' },
  { q: 'Is there a free trial?', a: 'Yes! The Free plan gives you 3 complete Shorts with no credit card required. See the quality for yourself before upgrading.' },
  { q: 'What happens when I hit my monthly limit?', a: 'You can upgrade anytime or wait for your credits to reset on your billing date. We never delete your existing Shorts.' },
  { q: 'Can I switch plans?', a: 'Absolutely. Upgrade or downgrade anytime. When upgrading, you get immediate access. Downgrades take effect next billing cycle.' },
  { q: 'Do you offer refunds?', a: 'Yes — we offer a 7-day money-back guarantee on all paid plans, no questions asked.' },
]

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handlePayment(plan: typeof plans[0]) {
    if (plan.ctaLink) {
      window.location.href = plan.ctaLink
      return
    }
    if (plan.name === 'Agency') {
      window.location.href = 'mailto:hello@clipforge.ai?subject=Agency Plan Inquiry'
      return
    }

    setLoadingPlan(plan.name)

    try {
      const amount = yearly ? plan.yearlyINR : plan.monthlyINR

      // Load Razorpay script
      await new Promise<void>((resolve) => {
        if (window.Razorpay) { resolve(); return }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        document.body.appendChild(script)
      })

      // Create order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.name, amount })
      })
      const { order } = await res.json()

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ClipForge AI',
        description: `${plan.name} Plan — ${yearly ? 'Yearly' : 'Monthly'}`,
        order_id: order.id,
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: plan.color,
        },
        handler: function(response: any) {
          window.location.href = `/dashboard?payment=success&plan=${plan.name}`
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }

    setLoadingPlan(null)
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#050d1a]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">C</div>
            <span className="font-black text-xl">ClipForge AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-bold px-5 py-2 rounded-full transition-all">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c8ff]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#7b2fff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative pt-32 pb-24 px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-[#00c8ff]/30 bg-[#00c8ff]/10 rounded-full px-4 py-2 text-sm text-[#00c8ff] font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00c8ff] animate-pulse" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
            Invest in your
            <br />
            <span className="bg-gradient-to-r from-[#00c8ff] via-[#7b2fff] to-[#ff6b35] bg-clip-text text-transparent">
              creator journey
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-10">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5">
            <button onClick={() => setYearly(false)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!yearly ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${yearly ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              Yearly
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-black">-20%</span>
            </button>
          </div>
          {yearly && (
            <p className="text-green-400 text-sm mt-3 font-semibold animate-pulse">
              🎉 You save up to ₹29,760/year on Agency plan!
            </p>
          )}
        </div>

        {/* Plans */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-24">
          {plans.map(plan => (
            <div key={plan.name}
              className={`relative rounded-3xl border flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.highlight
                  ? 'border-[#00c8ff] bg-gradient-to-b from-[#00c8ff]/10 via-[#00c8ff]/5 to-transparent shadow-[0_0_60px_rgba(0,200,255,0.15)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}>

              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.gradient} text-white shadow-lg`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-4 text-2xl shadow-lg`}>
                    {plan.name === 'Spark' ? '✨' : plan.name === 'Starter' ? '🚀' : plan.name === 'Pro' ? '⚡' : '🏢'}
                  </div>
                  <h2 className="text-2xl font-black mb-1">{plan.name}</h2>
                  <p className="text-gray-400 text-sm">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  {plan.monthlyINR === 0 ? (
                    <div className="text-5xl font-black">Free</div>
                  ) : (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-black">
                          ₹{yearly ? plan.yearlyINR.toLocaleString() : plan.monthlyINR.toLocaleString()}
                        </span>
                        <span className="text-gray-400 mb-1">/mo</span>
                      </div>
                      {yearly && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-500 line-through text-sm">₹{plan.monthlyINR.toLocaleString()}</span>
                          <span className="text-green-400 text-xs font-bold">Save 20%</span>
                        </div>
                      )}
                      <div className="text-gray-500 text-xs mt-1">≈ {plan.monthlyUSD}/mo</div>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-center gap-2.5 text-sm ${f.included ? 'text-gray-200' : 'text-gray-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${f.included ? `bg-gradient-to-br ${plan.gradient}` : 'bg-white/5'}`}>
                        {f.included ? '✓' : '✕'}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loadingPlan === plan.name}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlight
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 hover:scale-105 shadow-lg`
                      : plan.monthlyINR === 0
                      ? 'border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/5'
                      : `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`
                  }`}>
                  {loadingPlan === plan.name ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : plan.cta}
                </button>

                {plan.monthlyINR > 0 && plan.name !== 'Agency' && (
                  <p className="text-center text-gray-600 text-xs mt-3">
                    7-day money-back guarantee
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Razorpay' },
              { icon: '↩️', title: '7-Day Refund', desc: 'No questions asked' },
              { icon: '⚡', title: 'Instant Access', desc: 'Activate immediately' },
              { icon: '🇮🇳', title: 'UPI & Cards', desc: 'All payment methods' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-gray-400 text-xs mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature comparison */}
        <div className="max-w-5xl mx-auto mb-24 overflow-x-auto">
          <h2 className="text-4xl font-black text-center mb-12">Compare everything</h2>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-5 border-b border-white/10">
              <div className="px-6 py-4 text-sm text-gray-400 font-semibold">Feature</div>
              {['Spark', 'Starter', 'Pro', 'Agency'].map((p, i) => (
                <div key={p} className={`px-4 py-4 text-center text-sm font-black ${i === 1 ? 'bg-[#00c8ff]/5 text-[#00c8ff]' : i === 2 ? 'text-[#7b2fff]' : i === 3 ? 'text-[#ff6b35]' : ''}`}>
                  {p}
                </div>
              ))}
            </div>
            {[
              { feature: 'Shorts/month', values: ['3', '20', 'Unlimited', 'Unlimited'] },
              { feature: 'Export quality', values: ['720p', '1080p', '1080p', '1080p'] },
              { feature: 'Watermark', values: ['Yes', 'No', 'No', 'Custom'] },
              { feature: 'AI voices', values: ['2', '5', '20+', '20+'] },
              { feature: 'Voice cloning', values: ['✕', '✕', '✓', '✓'] },
              { feature: 'YouTube upload', values: ['✕', '✓', '✓', '✓'] },
              { feature: 'Analytics', values: ['✕', '✕', '✓', '✓'] },
              { feature: 'Team seats', values: ['1', '1', '1', '5'] },
              { feature: 'API access', values: ['✕', '✕', '✕', '✓'] },
            ].map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <div className="px-6 py-3.5 text-sm text-gray-400">{row.feature}</div>
                {row.values.map((val, j) => (
                  <div key={j} className={`px-4 py-3.5 text-sm text-center font-semibold ${val === '✕' ? 'text-gray-600' : val === '✓' ? 'text-green-400' : 'text-white'} ${j === 1 ? 'bg-[#00c8ff]/5' : ''}`}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl font-black text-center mb-12">Got questions?</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left">
                  <span className="font-bold text-sm pr-4">{faq.q}</span>
                  <span className={`text-gray-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-white/10">
                    <p className="text-gray-400 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-[#00c8ff]/10 via-[#7b2fff]/10 to-[#ff6b35]/10 border border-white/10 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00c8ff]/5 to-[#7b2fff]/5" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                Ready to go viral?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of creators publishing cinematic Shorts every day. Start free — no credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup"
                  className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-10 py-5 rounded-2xl text-lg hover:opacity-90 transition-all hover:scale-105 inline-block">
                  Start Free Today →
                </Link>
                <Link href="/dashboard"
                  className="border border-white/20 hover:border-white/40 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all inline-block hover:bg-white/5">
                  See Demo
                </Link>
              </div>
              <p className="text-gray-600 text-sm mt-6">3 free Shorts · No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

Save **Ctrl+S**.

---

Now add Razorpay keys to Vercel too:

**1.** Go to Vercel → your project → **Settings** → **Environment Variables**
**2.** Add:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET = xxxxxxxxxxxxxxxxxx