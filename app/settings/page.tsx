'use client'
import { useState } from 'react'
import Link from 'next/link'

const voices = [
  { id: 'nova',    name: 'Nova',    desc: 'Warm & friendly',      gender: '♀', preview: '🎙️' },
  { id: 'echo',    name: 'Echo',    desc: 'Deep & authoritative', gender: '♂', preview: '🎙️' },
  { id: 'aria',    name: 'Aria',    desc: 'Clear & professional', gender: '♀', preview: '🎙️' },
  { id: 'orion',   name: 'Orion',   desc: 'Bold & energetic',     gender: '♂', preview: '🎙️' },
  { id: 'sage',    name: 'Sage',    desc: 'Calm & trustworthy',   gender: '♀', preview: '🎙️' },
  { id: 'atlas',   name: 'Atlas',   desc: 'Strong & cinematic',   gender: '♂', preview: '🎙️' },
]

const tabs = ['Profile', 'Voice', 'Preferences', 'Subscription']

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [selectedVoice, setSelectedVoice] = useState('nova')
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('Aryan Singh')
  const [email, setEmail] = useState('aryancreative3@gmail.com')
  const [channel, setChannel] = useState('')
  const [defaultStyle, setDefaultStyle] = useState('Educational')
  const [autoUpload, setAutoUpload] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [watermark, setWatermark] = useState(true)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white">

      {/* Nav */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">C</div>
          <span className="font-black text-xl">ClipForge AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-xs font-black">A</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="flex gap-8">

          {/* Sidebar tabs */}
          <div className="w-48 shrink-0">
            <div className="space-y-1">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {tab === 'Profile' && '👤 '}
                  {tab === 'Voice' && '🎙️ '}
                  {tab === 'Preferences' && '⚙️ '}
                  {tab === 'Subscription' && '💳 '}
                  {tab}
                </button>
              ))}
            </div>

            {/* Danger zone */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
                🚪 Log Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">

            {/* PROFILE TAB */}
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-black mb-6">Profile Information</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-3xl font-black">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <button className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all font-semibold">
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-2">Full Name</label>
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00c8ff]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-2">Email Address</label>
                      <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00c8ff]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-2">YouTube Channel URL</label>
                      <input
                        value={channel}
                        onChange={e => setChannel(e.target.value)}
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-black mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-2">New Password</label>
                      <input type="password" placeholder="Min. 8 characters"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VOICE TAB */}
            {activeTab === 'Voice' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-black mb-2">Voice Selection</h2>
                <p className="text-gray-400 text-sm mb-6">Choose the AI voice for your Shorts. Upgrade to Pro to clone your own voice.</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {voices.map(v => (
                    <button key={v.id} onClick={() => setSelectedVoice(v.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${selectedVoice === v.id ? 'border-[#00c8ff] bg-[#00c8ff]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${selectedVoice === v.id ? 'border-[#00c8ff] bg-[#00c8ff]/20' : 'border-white/10 bg-white/10'}`}>
                        {v.gender}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{v.name}</div>
                        <div className="text-xs text-gray-400">{v.desc}</div>
                      </div>
                      {selectedVoice === v.id && (
                        <span className="ml-auto text-[#00c8ff] text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Voice clone promo */}
                <div className="bg-gradient-to-r from-[#7b2fff]/20 to-[#00c8ff]/20 border border-[#7b2fff]/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm mb-1">🎤 Clone Your Own Voice</div>
                    <div className="text-xs text-gray-400">Upload a 1-minute sample and sound exactly like you</div>
                  </div>
                  <button className="bg-[#7b2fff] hover:bg-[#6920ee] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shrink-0 ml-4">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'Preferences' && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-black mb-6">Content Preferences</h2>
                  <div className="space-y-6">

                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-3">Default Style</label>
                      <div className="flex flex-wrap gap-2">
                        {['Educational', 'Motivational', 'Cinematic', 'Trending', 'Storytelling'].map(s => (
                          <button key={s} onClick={() => setDefaultStyle(s)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${defaultStyle === s ? 'bg-[#00c8ff] text-black border-[#00c8ff]' : 'border-white/20 text-gray-300 hover:border-white/40'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4 pt-2">
                      {[
                        { label: 'Auto-upload to YouTube', desc: 'Automatically publish Shorts after generation', val: autoUpload, set: setAutoUpload },
                        { label: 'Email Notifications', desc: 'Get notified when your Short is ready', val: emailNotifs, set: setEmailNotifs },
                        { label: 'Show Watermark', desc: 'Add ClipForge watermark (free plan)', val: watermark, set: setWatermark },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between py-3 border-t border-white/10">
                          <div>
                            <div className="font-semibold text-sm">{item.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                          </div>
                          <button onClick={() => item.set(!item.val)}
                            className={`w-12 h-6 rounded-full transition-all relative ${item.val ? 'bg-[#00c8ff]' : 'bg-white/20'}`}>
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.val ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === 'Subscription' && (
              <div className="space-y-4">
                {/* Current plan */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black">Current Plan</h2>
                    <span className="bg-[#00c8ff]/20 text-[#00c8ff] text-xs font-bold px-3 py-1 rounded-full border border-[#00c8ff]/30">FREE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-[#00c8ff]">3</div>
                      <div className="text-xs text-gray-400 mt-1">Shorts Left</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white">720p</div>
                      <div className="text-xs text-gray-400 mt-1">Max Quality</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-yellow-400">5</div>
                      <div className="text-xs text-gray-400 mt-1">Voices</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-[#00c8ff]/10 to-[#7b2fff]/10 border border-[#00c8ff]/20 rounded-xl p-4">
                    <div className="font-bold mb-1">You're on the Free plan</div>
                    <div className="text-sm text-gray-400">Upgrade to unlock unlimited Shorts, 1080p quality, voice cloning, and YouTube auto-upload.</div>
                  </div>
                </div>

                {/* Upgrade cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Starter', price: '$19', features: ['20 Shorts/month', 'No watermark', '1080p quality', 'YouTube upload'], color: '#00c8ff' },
                    { name: 'Pro', price: '$49', features: ['Unlimited Shorts', 'Voice cloning', 'Priority rendering', 'Analytics'], color: '#7b2fff' },
                  ].map(plan => (
                    <div key={plan.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                      <div className="font-black text-lg mb-1">{plan.name}</div>
                      <div className="text-3xl font-black mb-4" style={{ color: plan.color }}>{plan.price}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                      <ul className="space-y-2 mb-5">
                        {plan.features.map(f => (
                          <li key={f} className="text-xs text-gray-300 flex items-center gap-2">
                            <span style={{ color: plan.color }}>✓</span> {f}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full py-3 rounded-xl font-bold text-sm transition-all text-black"
                        style={{ background: `linear-gradient(135deg, ${plan.color}, #7b2fff)` }}>
                        Upgrade to {plan.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save button */}
            {activeTab !== 'Subscription' && (
              <div className="flex items-center gap-4 mt-6">
                <button onClick={handleSave}
                  className="bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-black px-8 py-3 rounded-xl hover:opacity-90 transition-all">
                  Save Changes
                </button>
                {saved && (
                  <span className="text-green-400 text-sm font-semibold flex items-center gap-2">
                    <span>✓</span> Saved successfully!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}