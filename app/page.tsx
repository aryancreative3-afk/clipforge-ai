import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050d1a] text-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </main>
  )
}