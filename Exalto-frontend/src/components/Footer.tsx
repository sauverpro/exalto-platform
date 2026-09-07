import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1008] text-white">

      {/* Newsletter */}
      <div className="border-b border-[#2a1f1a] bg-[#c94708]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-5 py-8 sm:flex-row sm:px-8 lg:px-12">
          <div>
            <p className="text-lg font-black text-white">Stay Updated</p>
            <p className="text-sm text-white/80">Get the latest products, offers, and news from Exalto.</p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:bg-white/20 border border-white/20 focus:border-white/50"
            />
            <button type="submit" className="bg-[#251c18] px-5 py-3 text-sm font-bold text-white hover:bg-black transition flex-shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c94708]">
                <span className="text-base font-black text-white">E</span>
              </div>
              <span className="text-lg font-black text-white">EXALTO</span>
            </div>
            <p className="text-sm leading-7 text-white/50">
              Rwanda's premier natural beverage company. Crafting premium juices and wines from locally sourced ingredients.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: "#", label: "f" },
                { href: "#", label: "𝕏" },
                { href: "#", label: "in" },
              ].map(({ href, label }) => (
                <a key={label} href={href} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a1f1a] text-white/50 hover:bg-[#c94708] hover:text-white transition font-bold text-sm">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Shop</h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/shop", label: "All Products" },
                { to: "/shop", label: "Fresh Juices" },
                { to: "/shop", label: "Natural Wines" },
                { to: "/cart", label: "My Cart" },
                { to: "/favorites", label: "Saved Items" },
              ].map(({ to, label }) => (
                <Link key={label} to={to} className="text-sm text-white/50 hover:text-[#c94708] transition">{label}</Link>
              ))}
            </nav>
          </div>

          {/* Business */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Business</h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/wholesale", label: "Wholesale" },
                { to: "/export", label: "Export" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/customer-dashboard", label: "My Account" },
              ].map(({ to, label }) => (
                <Link key={label} to={to} className="text-sm text-white/50 hover:text-[#c94708] transition">{label}</Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#c94708]" />
                <p className="text-sm text-white/50">Kamonyi, Rwanda</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-[#c94708]" />
                <a href="tel:+250788537463" className="text-sm text-white/50 hover:text-[#c94708] transition">+250 788 537 463</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-[#c94708]" />
                <a href="mailto:exaltoltd@gmail.com" className="text-sm text-white/50 hover:text-[#c94708] transition">exaltoltd@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a1f1a]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row sm:px-8 lg:px-12">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Exalto Engineering & Supply Solutions Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-white/30 hover:text-white/60 transition">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition">Terms</Link>
            <Link to="/faqs" className="text-xs text-white/30 hover:text-white/60 transition">FAQs</Link>
            <Link to="/admin-login" className="text-xs text-white/20 hover:text-[#c94708]/60 transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
