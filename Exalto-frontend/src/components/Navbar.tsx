import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

function Navbar() {
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  useEffect(() => {
    function onScroll() {
      setNavSolid(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearchClick = () => {
    navigate('/shop')
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all ${navSolid ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[72px] sm:h-[96px] items-center justify-between max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="Exalto home">
          <img src="/assets/logo.svg" alt="Exalto" className="h-10 sm:h-16 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-lg font-medium text-black hover:text-orange-600">Home</Link>
          <Link to="/shop" className="text-lg font-medium text-black hover:text-orange-600">Shop</Link>
          <Link to="/about" className="text-lg font-medium text-black hover:text-orange-600">About</Link>
          <Link to="/contact" className="text-lg font-medium text-black hover:text-orange-600">Contact</Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={handleSearchClick}
            aria-label="Search"
            className="relative hidden h-10 w-10 sm:flex sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] hover:bg-[#ede5dd] transition"
          >
            <Search size={20} />
          </button>

          <button type="button" aria-label="Shopping cart" className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] hover:bg-[#ede5dd] transition">
            <Link to="/cart" aria-label="Open shopping cart"><ShoppingCart size={20} /></Link>
            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c94708] text-xs font-bold text-white">{itemCount}</span>}
          </button>

          <Link to="/login" aria-label="Account" className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] hover:bg-[#ede5dd] transition sm:flex sm:h-12 sm:w-12"><UserRound size={20} /></Link>

          <button type="button" aria-label="Wishlist" className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] hover:bg-[#ede5dd] transition">
            <Link to="/favorites" aria-label="View favorites" className="flex items-center justify-center">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#c94708] text-xs font-bold text-white">{favorites.length}</span>}
            </Link>
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f1f1] text-[#c94708] hover:bg-[#ede5dd] transition lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-[#e9e1d9] bg-white/95 px-4 py-4 shadow-md lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 text-left text-base font-medium text-[#2a1f1a]">
            <Link to="/" className="py-2">Home</Link>
            <Link to="/shop" className="py-2">Shop</Link>
            <Link to="/about" className="py-2">About</Link>
            <Link to="/contact" className="py-2">Contact</Link>
            <Link to="/login" className="py-2">My account</Link>
            <Link to="/admin-login" className="py-2 text-xs text-[#c94708]/60 hover:text-[#c94708] transition">Admin</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
