import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
import logoImage from "../assets/logo-image.png";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "sales_manager"
        ? "/sales-manager-dashboard"
        : "/customer-dashboard";

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 bg-white shadow-sm`}
    >
      <div className="mx-auto flex h-[72px] sm:h-[88px] items-center justify-between max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label="Exalto home"
        >
          <img src={logoImage} alt="Exalto" className="h-9 sm:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/about", label: "About" },
            { to: "/wholesale", label: "Wholesale" },
            { to: "/export", label: "Export" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${isActive(to) ? "text-brand" : "text-navy hover:text-brand"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/shop")}
            aria-label="Search"
            className="hidden h-9 w-9 sm:flex items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-line transition"
          >
            <Search size={17} />
          </button>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-line transition"
          >
            <ShoppingCart size={17} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            to="/favorites"
            aria-label="Wishlist"
            className="relative hidden h-9 w-9 sm:flex items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-line transition"
          >
            <Heart size={17} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-xs font-bold hover:bg-brand-dark transition"
                aria-label="User menu"
              >
                {user?.full_name?.[0]?.toUpperCase() ?? <UserRound size={17} />}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-line bg-white shadow-lg py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-navy truncate">
                    {user?.full_name}
                  </p>
                  <p className="px-4 pb-2 text-[10px] text-concrete truncate border-b border-line">
                    {user?.email}
                  </p>
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-brand-soft"
                  >
                    <LayoutDashboard size={14} /> My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label="Account"
              className="hidden h-9 w-9 sm:flex items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-line transition"
            >
              <UserRound size={17} />
            </Link>
          )}

          <Link
            to="/shop"
            className="hidden lg:inline-flex items-center gap-1.5 bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition"
          >
            Order Now
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-brand hover:bg-line transition lg:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-line bg-white px-5 py-4 shadow-lg sm:max-h-[calc(100svh-88px)] lg:hidden">
          <div className="flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About" },
              { to: "/wholesale", label: "Wholesale" },
              { to: "/export", label: "Export" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(to) ? "bg-brand/10 text-brand" : "text-navy hover:bg-brand-soft"}`}
              >
                {label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link
              to="/favorites"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy hover:bg-brand-soft"
            >
              <Heart size={15} /> Wishlist{" "}
              {favorites.length > 0 && `(${favorites.length})`}
            </Link>
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2">
                  <p className="truncate text-xs font-semibold text-navy">
                    {user?.full_name}
                  </p>
                  <p className="truncate text-[10px] text-concrete">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy hover:bg-brand-soft"
                >
                  <LayoutDashboard size={15} /> My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy hover:bg-brand-soft"
              >
                <UserRound size={15} /> Sign In
              </Link>
            )}
            <Link
              to="/shop"
              className="mt-2 block bg-brand px-4 py-3 text-center text-sm font-bold text-white hover:bg-brand-dark"
            >
              Order Now
            </Link>
            <Link
              to="/admin-login"
              className="mt-1 block px-4 py-2 text-center text-xs text-brand/40 hover:text-brand/70 transition"
            >
              Admin Portal
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
