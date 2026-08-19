import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2a2a2a] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Section - Company Info & Social Links */}
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold mb-8">EXALTO ENGINEERING AND SUPPLY SOLUTIONS LTD</h3>
            <div className="flex gap-6">
              <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-[#c94708] transition-colors font-bold text-sm">f</a>
              <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-[#c94708] transition-colors font-bold text-sm">𝕏</a>
              <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-[#c94708] transition-colors font-bold text-sm">in</a>
              <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4a4a4a] text-white hover:bg-[#c94708] transition-colors font-bold text-sm">P</a>
            </div>
          </div>

          {/* Center Section - Latest Collection Links */}
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold mb-8">LATEST COLLECTION</h3>
            <nav className="flex flex-col gap-4">
              <a href="/" className="text-white/80 hover:text-[#c94708] transition-colors">Home</a>
              <a href="/shop" className="text-white/80 hover:text-[#c94708] transition-colors">Shop</a>
              <a href="/about" className="text-white/80 hover:text-[#c94708] transition-colors">About</a>
              <a href="/contact" className="text-white/80 hover:text-[#c94708] transition-colors">Contact</a>
            </nav>
          </div>

          {/* Right Section - Address Info */}
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold mb-8">OUR ADDRESS</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 shrink-0 text-[#c94708]" />
                <p className="text-white/80">Kamonyi, Rwanda</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="mt-1 shrink-0 text-[#c94708]" />
                <a href="tel:+250788537463" className="text-white/80 hover:text-[#c94708] transition-colors">+250 788 537 463</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="mt-1 shrink-0 text-[#c94708]" />
                <a href="mailto:exaltoltd@gmail.com" className="text-white/80 hover:text-[#c94708] transition-colors">exaltoltd@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-[#4a4a4a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/70 text-sm sm:text-base">
            © Copyright 2026 | Exalto Ltd | All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
