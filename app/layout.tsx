import type { Metadata } from 'next'
import './globals.css'
import FloatingAgent from './components/FloatingAgent'

export const metadata: Metadata = {
  title: 'ClipForge AI — Type an idea. Get a cinematic Short.',
  description: 'ClipForge AI writes the script, records the voice, generates visuals, adds captions, scores the music — and uploads to YouTube automatically.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050d1a] text-white antialiased">
        {children}
        <FloatingAgent />
      </body>
    </html>
  )
}