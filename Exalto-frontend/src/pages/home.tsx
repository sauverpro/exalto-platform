import { Link } from "react-router-dom";
import { ChevronRight, Leaf, Shield, Truck, Star, ArrowRight } from "lucide-react";
import { products } from "../data/product";
import ProductCard from "../components/productcard";

const CATEGORIES = [
  { name: "Fresh Juices", count: 4, color: "bg-amber-50 border-amber-200", img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80" },
  { name: "Natural Wines", count: 3, color: "bg-rose-50 border-rose-200", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80" },
  { name: "Wholesale", count: 10, color: "bg-green-50 border-green-200", img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80" },
  { name: "Export Produce", count: 6, color: "bg-orange-50 border-orange-200", img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
];

const FEATURES = [
  { icon: Leaf, title: "100% Natural", desc: "No artificial additives. Pure ingredients from Rwanda's finest farms." },
  { icon: Shield, title: "Quality Certified", desc: "Every batch tested and certified to meet international standards." },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery in Kigali. Nationwide and export shipping available." },
  { icon: Star, title: "Premium Grade", desc: "Only Grade A produce selected for our beverages and export catalog." },
];

const TESTIMONIALS = [
  { name: "Jean-Pierre M.", role: "Restaurant Owner, Kigali", text: "Exalto's passion juice is the best we've served. Our customers always ask for more. Consistent quality every delivery.", rating: 5 },
  { name: "Sarah K.", role: "Wholesale Buyer", text: "Reliable supply, great pricing, and the team is always responsive. Our go-to supplier for natural beverages.", rating: 5 },
  { name: "David N.", role: "Export Partner, Nairobi", text: "The sugarcane wine has been a hit in our market. Packaging is excellent and shipments always arrive on time.", rating: 5 },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#2a1f1a]">

      {/* Hero */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(10,8,5,0.93) 0%, rgba(30,15,5,0.82) 55%, rgba(10,8,5,0.55) 100%), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2200&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] justify-center px-5 py-32 text-center sm:px-12 lg:px-16">
          <div className="flex max-w-none flex-col items-center">
            
            <h1 className="whitespace-nowrap text-4xl font-black leading-[1.0] tracking-tight !text-white sm:text-6xl lg:text-8xl">
              EXALTO <span className="text-[#c94708]">FRESH</span> PRODUCE
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
              Premium natural beverages and fresh produce from Rwanda's finest farms. Supplying local businesses, wholesale buyers, and international export partners.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#c94708] px-8 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(201,71,8,0.4)] transition hover:bg-[#9f3506]"
              >
                Shop Now <ChevronRight size={18} />
              </Link>
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-sm font-bold text-white transition hover:border-[#c94708] hover:text-[#c94708]"
              >
                Wholesale Enquiry
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {[["500+", "Happy Clients"], ["100%", "Natural"], ["2+", "Products"], ["Rwanda", "Origin"]].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-[#c94708]">{val}</p>
                  <p className="text-xs font-medium text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Announcement bar */}
      <div className="bg-[#c94708] px-5 py-3 text-center">
        <p className="text-xs font-semibold text-white">
           Free delivery on orders in Kigali &nbsp;·&nbsp; Export inquiries welcome &nbsp;·&nbsp;
          <Link to="/wholesale" className="underline hover:no-underline">Open a wholesale account →</Link>
        </p>
      </div>

      {/* Categories */}
      <section className="bg-[#fffdf8] px-5 py-20 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Browse by Category</p>
              <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Shop Our Range</h2>
            </div>
            <Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-[#c94708] hover:underline sm:flex">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {CATEGORIES.map(({ name, count, color, img }) => (
              <Link
                key={name}
                to="/shop"
                className={`group overflow-hidden rounded-2xl border ${color} bg-white transition hover:shadow-[0_12px_40px_rgba(201,71,8,0.12)]`}
              >
                <div className="h-44 overflow-hidden sm:h-52">
                  <img src={img} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#251c18]">{name}</h3>
                  <p className="mt-0.5 text-xs text-[#77716d]">{count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#eadfce] bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10">
                <Icon size={22} className="text-[#c94708]" />
              </div>
              <div>
                <h3 className="font-bold text-[#251c18]">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#77716d]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#fffdf8] px-5 py-20 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">Fresh & Natural</p>
              <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Featured Products</h2>
            </div>
            <Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-[#c94708] hover:underline sm:flex">
              View all products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 border border-[#eee8e2] bg-white sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
              View all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Wholesale Banner */}
      <section
        className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(37,28,24,0.97) 0%, rgba(60,20,5,0.92) 60%, rgba(37,28,24,0.85) 100%), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] justify-center px-5 text-center">
          <div className="max-w-4xl">
            <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">For Business Buyers</p>
            <h2 className="mt-4 whitespace-nowrap text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Wholesale & <span className="text-[#c94708]">Export Solutions</span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/70">
              We supply restaurants, hotels, supermarkets, and international distributors with premium Rwandan beverages. Competitive bulk pricing, flexible delivery schedules, and dedicated account management.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/wholesale" className="inline-flex items-center gap-2 bg-[#c94708] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#9f3506] transition">
                Open Wholesale Account <ChevronRight size={16} />
              </Link>
              <Link to="/export" className="inline-flex items-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:border-[#c94708] hover:text-[#c94708] transition">
                Export Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f3efe9] px-5 py-20 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c94708]">What Our Clients Say</p>
            <h2 className="mt-2 text-3xl font-black text-[#251c18] sm:text-4xl">Trusted by Businesses</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <div key={name} className="rounded-2xl border border-[#eadfce] bg-white p-7 shadow-sm">
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#c94708] text-[#c94708]" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#6d6b69]">"{text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-[#eadfce] pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c94708]/10 text-sm font-bold text-[#c94708]">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#251c18]">{name}</p>
                    <p className="text-xs text-[#77716d]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#c94708] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="whitespace-nowrap text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Ready to Order?
          </h2>
          <p className="mx-auto mt-4 max-w-none whitespace-normal break-words text-sm leading-6 text-white/80 sm:whitespace-nowrap sm:text-base">
            Create your account today and start ordering Rwanda's finest natural beverages. Fast delivery, easy checkout, and dedicated support.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-bold text-[#c94708] hover:bg-[#f3efe9] transition">
              Create Account <ChevronRight size={16} />
            </Link>
            <Link to="/shop" className="inline-flex items-center gap-2 border border-white/40 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
