export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c8ff] to-[#7b2fff] flex items-center justify-center text-sm font-black">
            C
          </div>
          <span className="font-black text-xl">ClipForge AI</span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2025 ClipForge AI. Built by Aryan Singh.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}