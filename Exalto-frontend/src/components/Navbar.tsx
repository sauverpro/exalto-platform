import { useEffect, useState } from 'react'
import {
  Heart,
  Search,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react'

function Navbar() {
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setNavSolid(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all ${navSolid ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[72px] sm:h-[96px] items-center justify-between max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center" aria-label="Exalto home">
          <img src="/assets/logo.svg" alt="Exalto" className="h-10 sm:h-16 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-lg font-medium text-black hover:text-orange-600">Home</a>
          <a href="/shop" className="text-lg font-medium text-black hover:text-orange-600">Shop</a>
          <a href="/about" className="text-lg font-medium text-black hover:text-orange-600">About</a>
          <a href="/contact" className="text-lg font-medium text-black hover:text-orange-600">Contact</a>
        </nav>

        <div className="flex items-center gap-3 sm:gap-6">
          <button type="button" aria-label="Search" className="relative hidden h-10 w-10 sm:flex sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
            <Search size={20} />
          </button>

          <button type="button" aria-label="Shopping cart" className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
            <ShoppingCart size={20} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c94708] text-xs font-bold text-white">0</span>
          </button>

          <button type="button" aria-label="Wishlist" className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708]">
            <Heart size={20} />
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-[#e9e1d9] bg-white/95 px-4 py-4 shadow-md lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 text-left text-base font-medium text-[#2a1f1a]">
            <a href="/" className="py-2">Home</a>
            <a href="/shop" className="py-2">Shop</a>
            <a href="/about" className="py-2">About</a>
            <a href="/contact" className="py-2">Contact</a>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
