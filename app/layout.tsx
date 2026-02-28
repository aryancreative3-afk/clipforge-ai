import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClipForge AI',
  description: 'Type an idea. Get a cinematic Short.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}