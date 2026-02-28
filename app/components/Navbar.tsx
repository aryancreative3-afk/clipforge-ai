import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#050d1a]/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">
            C
          </div>
          <span className="font-black text-xl tracking-tight">ClipForge AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#how" className="hover:text-white transition-colors">How it Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-bold px-5 py-2 rounded-full transition-all">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  )
}