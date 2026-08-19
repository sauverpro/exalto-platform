import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Search,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import Footer from './components/Footer';


function App() {
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    function onScroll() {
      setNavSolid(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-all ${navSolid ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[72px] sm:h-[96px] items-center justify-between max-w-[1200px] px-4 sm:px-6 lg:px-8">

          <div className="flex items-center">
            <img src="/assets/logo.svg" alt="Exalto" className="h-10 sm:h-16 w-auto" />
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-lg font-medium text-black hover:text-orange-600">Home</a>
            <a href="/shop" className="text-lg font-medium text-black hover:text-orange-600">Shop</a>
            <a href="/about" className="text-lg font-medium text-black hover:text-orange-600">About</a>
            <a href="/contact" className="text-lg font-medium text-black hover:text-orange-600">Contact</a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
              <Search size={20} />
            </button>

            <button className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
              <ShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c94708] text-xs font-bold text-white">0</span>
            </button>

            <button className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[72px] sm:pt-[96px]">
        <section className="relative h-[calc(100vh-72px)] sm:h-[calc(100vh-96px)] w-full">
          <img src="/assets/hero.svg" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto max-w-3xl px-4 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">EXALTO</h1>
              <p className="mt-4 text-white/90 text-lg sm:text-xl">Fresh produce — direct from farm to business</p>
              <div className="mt-8">
                <a href="/shop" className="inline-flex h-12 sm:h-16 items-center justify-center rounded-full bg-gradient-to-r from-[#d63d05] to-[#d47728] px-6 sm:px-10 text-white font-bold text-sm sm:text-lg shadow-lg">SHOP NOW <ChevronRight className="ml-3" size={18} /></a>
              </div>
            </div>
          </div>

          <button aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#c94708] text-white flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>

          <button aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#c94708] text-white flex items-center justify-center">
            <ArrowRight size={20} />
          </button>
        </section>

        {/* Polished sections */}
       
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

export default App