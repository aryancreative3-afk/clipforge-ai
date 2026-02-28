'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#050d1a]/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">
            C
          </div>
          <span className="font-black text-xl tracking-tight">ClipForge AI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#how" className="hover:text-white transition-colors">How it Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-bold px-5 py-2 rounded-full transition-all">
            Get Started Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050d1a] px-6 py-4 space-y-4">
          <a href="#how" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white transition-colors py-2">How it Works</a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white transition-colors py-2">Features</a>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-white transition-colors py-2">Pricing</Link>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <Link href="/login" className="text-center py-3 border border-white/20 rounded-full text-sm font-semibold hover:border-white/40 transition-all">
              Log in
            </Link>
            <Link href="/signup" className="text-center py-3 bg-[#00c8ff] text-black font-bold rounded-full text-sm hover:bg-[#00a8dd] transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}