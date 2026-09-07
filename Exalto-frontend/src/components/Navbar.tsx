import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingCart, Menu, X, UserRound } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

function Navbar() {
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    function onScroll() { setNavSolid(window.scrollY > 24) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  const isActive = (path: string) => pathname === path

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${navSolid || mobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-[72px] sm:h-[88px] items-center justify-between max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Exalto home">
          <img src="/assets/logo.svg" alt="Exalto" className="h-9 sm:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/wholesale", label: "Wholesale" },
            { to: "/export", label: "Export" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${isActive(to) ? 'text-[#c94708]' : `${navSolid ? 'text-[#251c18]' : 'text-white'} hover:text-[#c94708]`}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            aria-label="Search"
            className={`hidden h-9 w-9 sm:flex items-center justify-center rounded-full transition ${navSolid ? 'bg-[#f3efe9] text-[#c94708] hover:bg-[#eadfce]' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <Search size={17} />
          </button>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition ${navSolid ? 'bg-[#f3efe9] text-[#c94708] hover:bg-[#eadfce]' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <ShoppingCart size={17} />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c94708] text-[9px] font-bold text-white">{itemCount}</span>}
          </Link>

          <Link
            to="/favorites"
            aria-label="Wishlist"
            className={`relative hidden h-9 w-9 sm:flex items-center justify-center rounded-full transition ${navSolid ? 'bg-[#f3efe9] text-[#c94708] hover:bg-[#eadfce]' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <Heart size={17} />
            {favorites.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c94708] text-[9px] font-bold text-white">{favorites.length}</span>}
          </Link>

          <Link
            to="/login"
            aria-label="Account"
            className={`hidden h-9 w-9 sm:flex items-center justify-center rounded-full transition ${navSolid ? 'bg-[#f3efe9] text-[#c94708] hover:bg-[#eadfce]' : 'bg-white/15 text-white hover:bg-white/25'}`}
          >
            <UserRound size={17} />
          </Link>

          <Link
            to="/shop"
            className="hidden lg:inline-flex items-center gap-1.5 bg-[#c94708] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9f3506] transition"
          >
            Order Now
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition lg:hidden ${navSolid || mobileMenuOpen ? 'bg-[#f3efe9] text-[#c94708]' : 'bg-white/15 text-white'}`}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-[#eadfce] bg-white px-5 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/wholesale", label: "Wholesale" },
              { to: "/export", label: "Export" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(to) ? 'bg-[#c94708]/10 text-[#c94708]' : 'text-[#251c18] hover:bg-[#f3efe9]'}`}
              >
                {label}
              </Link>
            ))}
            <div className="my-2 h-px bg-[#eadfce]" />
            <Link to="/login" className="rounded-lg px-4 py-3 text-sm font-semibold text-[#251c18] hover:bg-[#f3efe9]">My Account</Link>
            <Link to="/customer-dashboard" className="rounded-lg px-4 py-3 text-sm font-semibold text-[#251c18] hover:bg-[#f3efe9]">Order History</Link>
            <Link to="/shop" className="mt-2 block bg-[#c94708] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#9f3506]">Order Now</Link>
            <Link to="/admin-login" className="mt-1 block px-4 py-2 text-center text-xs text-[#c94708]/40 hover:text-[#c94708]/70 transition">Admin Portal</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
