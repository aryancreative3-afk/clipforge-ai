'use client'
import { useState } from 'react'

const suggestions = [
  '🎬 Make hook more dramatic',
  '💡 Suggest better title',
  '📊 Score my viral potential',
  '✂️ Make it under 45 seconds',
  '🔥 Rewrite in Cinematic style',
  '📣 Stronger CTA please',
]

export default function FloatingAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hi! I'm your ClipForge AI Agent 🤖 I can help you create better Shorts, improve scripts, suggest titles, and answer any questions. How can I help?" }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  async function handleSend(msg?: string) {
    const text = msg || input
    if (!text.trim()) return

    const newUserMsg = { role: 'user', text }
    const updatedMessages = [...messages, newUserMsg]
    setMessages(updatedMessages)
    setInput('')
    setTyping(true)
    setShowSuggestions(false)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          script: '',
          idea: 'general YouTube Shorts advice',
          style: 'Educational'
        })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'agent', text: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: '⚠️ Connection error. Please try again.' }])
    }

    setTyping(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${open ? 'bg-[#7b2fff]' : 'bg-gradient-to-br from-[#00c8ff] to-[#7b2fff]'}`}
        style={{ boxShadow: '0 0 30px rgba(0, 200, 255, 0.3)' }}
      >
        {open ? (
          <span className="text-white text-xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>

      {/* Unread dot */}
      {!open && (
        <div className="fixed bottom-16 right-6 z-50 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050d1a] animate-pulse" />
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#080f1e] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh', boxShadow: '0 0 60px rgba(123, 47, 255, 0.2)' }}>

          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#7b2fff]/20 to-[#00c8ff]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-lg">🤖</div>
              <div>
                <div className="font-black text-sm">ClipForge AI Agent</div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Online — Ready to help</span>
                </div>
              </div>
            </div>
            <button onClick={() => setMessages([{ role: 'agent', text: "Hi! I'm your ClipForge AI Agent 🤖 How can I help?" }])}
              className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-full px-2 py-1 transition-all">
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-xs shrink-0 mr-2 mt-1">🤖</div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#00c8ff] to-[#7b2fff] text-black font-semibold rounded-br-sm'
                    : 'bg-white/10 text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-xs shrink-0 mr-2">🤖</div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          {showSuggestions && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 4).map(s => (
                  <button key={s} onClick={() => handleSend(s)}
                    className="text-xs bg-white/5 border border-white/10 hover:border-[#00c8ff]/50 hover:bg-[#00c8ff]/10 rounded-full px-3 py-1.5 transition-all text-gray-300">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about Shorts..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7b2fff]/50 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b2fff] to-[#00c8ff] flex items-center justify-center text-white font-bold hover:opacity-90 transition-all disabled:opacity-30"
              >
                ↑
              </button>
            </div>
            <p className="text-center text-gray-600 text-xs mt-2">Powered by ClipForge AI</p>
          </div>
        </div>
      )}
    </>
  )
}