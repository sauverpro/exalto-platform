import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logoImage from "../assets/logo-image.png";
import { useText } from "../context/SiteContentContext";

export default function Footer() {
  const text = useText();
  const phone = text("footerPhone");
  const email = text("footerEmail");
  const socials = [
    { href: text("footerFacebook", "#"), label: "f", name: "Facebook" },
    { href: text("footerTwitter", "#"), label: "𝕏", name: "X" },
    { href: text("footerLinkedin", "#"), label: "in", name: "LinkedIn" },
  ];

  return (
    <footer className="bg-navy-dark text-white">

      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-5 py-16 text-left sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 items-start gap-10 md:grid-cols-4 lg:gap-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logoImage} alt="Exalto" className="h-10 w-10 object-contain" />
              <span className="text-lg font-black text-white">EXALTO</span>
            </div>
            <p className="text-sm leading-7 text-white/50">
              {text("footerDescription")}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, label, name }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={name}
                  // Real profile links open in a new tab; "#" placeholders stay put.
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white/50 hover:bg-brand hover:text-white transition font-bold text-sm"
                >
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
                <Link key={label} to={to} className="text-sm text-white/50 hover:text-brand transition">{label}</Link>
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
                <Link key={label} to={to} className="text-sm text-white/50 hover:text-brand transition">{label}</Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand" />
                <p className="text-sm text-white/50">{text("footerAddress")}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-brand" />
                {/* tel: links need the number without spaces or dashes */}
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-sm text-white/50 hover:text-brand transition">{phone}</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-brand" />
                <a href={`mailto:${email}`} className="text-sm text-white/50 hover:text-brand transition">{email}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row sm:px-8 lg:px-12">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} {text("footerCopyright")}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-white/30 hover:text-white/60 transition">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition">Terms</Link>
            <Link to="/faqs" className="text-xs text-white/30 hover:text-white/60 transition">FAQs</Link>
            <Link to="/admin-login" className="text-xs text-white/20 hover:text-brand/60 transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
