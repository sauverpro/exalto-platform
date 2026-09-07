import { Link } from "react-router-dom";
import { Leaf, Award, Globe, Heart, ChevronRight, CheckCircle2 } from "lucide-react";
import sugarcaneJuice from "../assets/sugarcane juice.avif";
import passionJuice from "../assets/passion-juice.jpg";

const STATS = [
  { value: "100%", label: "Natural Ingredients" },
  { value: "2+", label: "Premium Products" },
  { value: "Rwanda", label: "Proudly Made In" },
  { value: "2024", label: "Year Founded" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Naturally Sourced",
    desc: "Every ingredient is locally grown in Rwanda's fertile highlands, supporting our farming communities.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    desc: "Rigorous quality control at every step ensures each bottle meets the highest standards.",
  },
  {
    icon: Globe,
    title: "Global Vision",
    desc: "Proudly Rwandan, crafted for the world — sharing our heritage one sip at a time.",
  },
  {
    icon: Heart,
    title: "Community First",
    desc: "We invest in local farmers, create jobs, and grow Rwanda's agro-processing industry.",
  },
];

const MILESTONES = [
  { year: "2022", title: "The Idea", desc: "Founded on a passion for Rwanda's agricultural richness and engineering excellence." },
  { year: "2023", title: "First Batch", desc: "Launched our first sugarcane wine and passion fruit juice to local markets." },
  { year: "2024", title: "Going Digital", desc: "Launched our e-commerce platform to reach customers across Rwanda and beyond." },
  { year: "2025", title: "Expanding", desc: "Scaling production and exploring international distribution partnerships." },
];

const AboutPage = () => {
  return (
    <main className="w-full bg-[#fffdf8] text-[#2a1f1a]">

      {/* Hero */}
      <section
        className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-5 pb-12 pt-36 sm:min-h-[500px]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(20,10,5,0.88) 0%, rgba(60,20,5,0.80) 60%, rgba(20,10,5,0.70) 100%), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fffdf8]/10" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c94708]">
            About Exalto
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Crafted with Purpose,<br />
            <span className="text-[#c94708]">Rooted in Rwanda</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            We transform Rwanda's finest sugarcane and passion fruit into premium natural beverages — pure, vibrant, and made for the world.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#c94708] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#9f3506] transition"
            >
              Shop Our Products <ChevronRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:border-[#c94708] hover:text-[#c94708] transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#eadfce] bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-[#eadfce] md:grid-cols-4 md:divide-y-0">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center justify-center px-6 py-8 text-center">
              <span className="text-3xl font-black text-[#c94708] sm:text-4xl">{value}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#77716d]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-28 lg:px-12">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(169,67,13,0.15)]">
            <img
              src={sugarcaneJuice}
              alt="Sugarcane and passion fruit"
              className="h-[420px] w-full object-cover sm:h-[520px]"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 -right-4 rounded-2xl border border-[#eadfce] bg-white px-6 py-4 shadow-lg sm:-right-8">
            <p className="text-2xl font-black text-[#c94708]">100%</p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#77716d]">Natural</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">Our Story</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#251c18] sm:text-5xl">
            Born from Rwanda's<br />
            <span className="text-[#c94708]">Finest Harvests</span>
          </h2>
          <div className="mt-5 flex gap-2">
            <span className="h-1.5 w-10 bg-[#c94708]" />
            <span className="h-1.5 w-10 bg-[#c94708]" />
          </div>
          <p className="mt-7 text-base leading-8 text-[#6d6b69] sm:text-lg">
            EXALTO ENGINEERING AND SUPPLY SOLUTIONS LTD was founded on a dual passion: a love for Rwanda's rich agricultural bounty and a drive for engineering excellence. We saw an opportunity to elevate two of our country's natural treasures — sugarcane and passion fruit — into premium beverages.
          </p>
          <p className="mt-5 text-base leading-8 text-[#6d6b69] sm:text-lg">
            By applying meticulous engineering principles to the art of beverage making, we developed a unique process that captures the authentic taste and vitality of our ingredients. From our base in Rwanda, we are not just a company — we are innovators dedicated to quality, sustainability, and the growth of Rwanda's agro-processing industry.
          </p>
          <ul className="mt-7 space-y-3">
            {["No artificial additives or preservatives", "Cold-pressed for maximum nutrients", "Supporting local Rwandan farmers"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-[#3d291c]">
                <CheckCircle2 size={18} className="flex-shrink-0 text-[#c94708]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#251c18] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">What We Stand For</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">Our Core Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-[#3d291c] bg-[#1a1008] p-7 transition hover:border-[#c94708]/50">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c94708]/10 transition group-hover:bg-[#c94708]/20">
                  <Icon size={22} className="text-[#c94708]" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#9a8a82]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-[#f3efe9] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">Where We're Headed</p>
            <h2 className="mt-4 text-4xl font-black text-[#251c18] sm:text-5xl">Vision & Mission</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(169,67,13,0.08)] sm:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#c94708]/5" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c94708]">Our Vision</p>
              <h3 className="mt-3 text-2xl font-black text-[#251c18] sm:text-3xl">Global Recognition</h3>
              <div className="my-5 h-px bg-[#eadfce]" />
              <p className="leading-8 text-[#6d6b69]">
                To be a globally recognized leader in the creation of innovative, natural beverages — showcasing the quality and potential of Rwandan-sourced ingredients on the world stage.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-[#c94708] p-8 shadow-[0_8px_30px_rgba(201,71,8,0.3)] sm:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/10" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Our Mission</p>
              <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">Sustainable Excellence</h3>
              <div className="my-5 h-px bg-white/20" />
              <p className="leading-8 text-white/85">
                To produce and supply superior natural wines and juices using innovative, sustainable manufacturing processes — creating value for local farming partners and delivering healthy products to customers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">Our Journey</p>
            <h2 className="mt-4 text-4xl font-black text-[#251c18] sm:text-5xl">How We Got Here</h2>
          </div>
          <div className="relative space-y-0">
            <div className="absolute left-[19px] top-2 h-full w-px bg-[#eadfce] sm:left-1/2 sm:-translate-x-px" />
            {MILESTONES.map(({ year, title, desc }, i) => (
              <div key={year} className={`relative flex gap-6 pb-10 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                <div className={`hidden sm:flex sm:w-1/2 ${i % 2 === 0 ? "sm:justify-end sm:pr-10" : "sm:justify-start sm:pl-10"}`}>
                  <div className="rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-6 shadow-sm max-w-xs w-full">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c94708]">{year}</span>
                    <h4 className="mt-2 text-lg font-bold text-[#251c18]">{title}</h4>
                    <p className="mt-2 text-sm leading-7 text-[#77716d]">{desc}</p>
                  </div>
                </div>
                {/* Dot */}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-4 border-[#f3efe9] bg-[#c94708] sm:absolute sm:left-1/2 sm:top-4 sm:-translate-x-1/2">
                  <span className="text-[10px] font-black text-white">{i + 1}</span>
                </div>
                {/* Mobile card */}
                <div className="flex-1 sm:hidden">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c94708]">{year}</span>
                  <h4 className="mt-1 text-lg font-bold text-[#251c18]">{title}</h4>
                  <p className="mt-1 text-sm leading-7 text-[#77716d]">{desc}</p>
                </div>
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product showcase */}
      <section className="bg-[#f3efe9] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">What We Make</p>
            <h2 className="mt-4 text-4xl font-black text-[#251c18] sm:text-5xl">Our Products</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
                name: "Vicas Sugarcane Wine",
                tag: "Natural Wine",
                desc: "A smooth, vibrant wine crafted from Rwanda's finest sugarcane. Rich in flavour, low in additives.",
                price: "Fr 12,000",
              },
              {
                img: passionJuice,
                name: "La Vie Passion Juice",
                tag: "Fresh Juice",
                desc: "Cold-pressed from ripe, locally sourced passion fruits. Tangy, aromatic, and intensely flavourful.",
                price: "Fr 9,000",
              },
            ].map((p) => (
              <article key={p.name} className="group overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm transition hover:shadow-[0_12px_40px_rgba(169,67,13,0.12)]">
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#c94708] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                    {p.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#251c18]">{p.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#77716d]">{p.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-[#c94708]">{p.price}</span>
                    <Link to="/shop" className="flex items-center gap-1 text-sm font-bold text-[#c94708] hover:underline">
                      View in Shop <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(20,10,5,0.92) 0%, rgba(60,20,5,0.88) 100%), url('https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c94708]">Join the Exalto Family</p>
          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
            Taste the Difference
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-white/70">
            Experience Rwanda's finest natural beverages. Order online and have them delivered to your door.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#c94708] px-8 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(201,71,8,0.4)] hover:bg-[#9f3506] transition"
            >
              Shop Now <ChevronRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-sm font-bold text-white hover:border-[#c94708] hover:text-[#c94708] transition"
            >
              Become a Distributor
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
