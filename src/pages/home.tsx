import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Leaf,
  Shield,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";
import { fetchStoreProducts } from "../api/products";
import type { Product } from "../data/product";
import ProductCard from "../components/productcard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { useText } from "../context/SiteContentContext";

// Icons stay in code; every string comes from the CMS.
const FEATURE_ICONS = [Leaf, Shield, Truck, Star];

function HomePage() {
  const text = useText();

  const features = FEATURE_ICONS.map((icon, index) => ({
    icon,
    title: text(`feature${index + 1}Title`),
    desc: text(`feature${index + 1}Desc`),
  }));

  const testimonials = [1, 2, 3].map((n) => ({
    name: text(`testimonial${n}Name`),
    role: text(`testimonial${n}Role`),
    text: text(`testimonial${n}Text`),
    rating: 5,
  }));

  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchStoreProducts()
      .then(setProducts)
      .catch(() => {
        setProductsError("Products could not be loaded.");
      })
      .finally(() => setProductsLoading(false));
  }, []);

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Counts come from the live catalogue. The remaining two are brand facts,
  // not metrics, so they stay editable in the CMS. Nothing here is invented —
  // there is no public endpoint for a customer count, so the old
  // "500+ Happy Clients" figure was removed rather than guessed at.
  const heroStats = [
    {
      value: productsLoading ? "—" : String(products.length),
      label: text("heroStat1Label"),
    },
    {
      value: productsLoading ? "—" : String(categories.length),
      label: text("heroStat2Label"),
    },
    { value: text("heroStat3Val"), label: text("heroStat3Label") },
    { value: text("heroStat4Val"), label: text("heroStat4Label") },
  ];

  return (
    <div className="min-h-screen bg-white text-navy">
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
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] justify-center px-5 py-24 text-center sm:px-12 sm:py-32 lg:px-16">
          <div className="flex max-w-none flex-col items-center">
            <h1 className="text-[2rem] font-black leading-[1.05] tracking-tight !text-white sm:text-6xl lg:text-8xl">
              {/* Second word keeps the accent colour, whatever the CMS title is */}
              {text("heroTitle")
                .split(" ")
                .map((word, index, words) => (
                  <span
                    key={`${word}-${index}`}
                    className={index === 1 ? "text-brand" : undefined}
                  >
                    {word}
                    {index < words.length - 1 ? " " : ""}
                  </span>
                ))}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-6 text-white/70 sm:mt-6 sm:text-lg sm:leading-7">
              {text("heroSubtitle")}
            </p>

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-brand px-8 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(31,107,69,0.4)] transition hover:bg-brand-dark"
              >
                {text("heroBtn1")}
                <ChevronRight size={18} />
              </Link>

              <Link
                to="/wholesale"
                className="inline-flex items-center justify-center gap-2 border border-white/30 px-8 py-4 text-sm font-bold text-white transition hover:border-brand hover:text-brand"
              >
                {text("heroBtn2")}
              </Link>
            </div>

            <div className="mt-10 grid w-full grid-cols-2 gap-6 sm:mt-12 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-8">
              {heroStats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl font-black text-brand sm:text-2xl">
                    {value}
                  </p>
                  <p className="text-xs font-medium text-white/50">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Bar */}
      <div className="bg-brand px-5 py-3 text-center">
        <p className="text-xs font-semibold text-white">
          Free delivery on orders in Kigali &nbsp;·&nbsp; Export inquiries
          welcome &nbsp;·&nbsp;{" "}
          <Link
            to="/wholesale"
            className="underline hover:no-underline"
          >
            Open a wholesale account →
          </Link>
        </p>
      </div>

      {/* Categories */}
      <section className="bg-offwhite px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Browse by Category
              </p>

              <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
                Shop Our Range
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-bold text-brand hover:underline sm:flex"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories.map((name) => {
              const categoryProducts = products.filter(
                (product) => product.category === name
              );

              const image = categoryProducts[0]?.image;

              return (
                <Link
                  key={name}
                  to="/shop"
                  className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-[0_12px_40px_rgba(31,107,69,0.12)]"
                >
                  <div className="h-44 overflow-hidden sm:h-52">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-brand-soft text-sm text-concrete">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-navy">{name}</h3>

                    <p className="mt-0.5 text-xs text-concrete">
                      {categoryProducts.length} products
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-line bg-offwhite p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_14px_36px_rgba(31,107,69,0.13)] sm:p-7"
            >
              {/* Accent rule that sweeps in from the left on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                {/* lucide icons stroke with currentColor, so they follow the tile */}
                <Icon size={22} />
              </div>

              <h3 className="mt-5 text-base font-bold text-navy">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-concrete">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-offwhite px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Fresh & Natural
              </p>

              <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
                Featured Products
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-bold text-brand hover:underline sm:flex"
            >
              View all products
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : productsError ? (
              <p className="col-span-full py-10 text-center text-sm text-red-600">
                {productsError}
              </p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-sm text-concrete">
                No products available.
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              View all products
              <ArrowRight size={16} />
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              For Business Buyers
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Wholesale &{" "}
              <span className="text-brand">
                Export Solutions
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/70">
              We supply restaurants, hotels, supermarkets, and international
              distributors with premium Rwandan beverages. Competitive bulk
              pricing, flexible delivery schedules, and dedicated account
              management.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Open Wholesale Account
                <ChevronRight size={16} />
              </Link>

              <Link
                to="/export"
                className="inline-flex items-center gap-2 border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-brand hover:text-brand"
              >
                Export Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-soft px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              What Our Clients Say
            </p>

            <h2 className="mt-2 text-3xl font-black text-navy sm:text-4xl">
              Trusted by Businesses
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, text, rating }) => (
              <div
                key={name}
                className="rounded-2xl border border-line bg-white p-7 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-ochre text-ochre"
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-concrete">
                  "{text}"
                </p>

                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {name[0]}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-navy">
                      {name}
                    </p>

                    <p className="text-xs text-concrete">
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Ready to Order?
          </h2>

          <p className="mx-auto mt-4 max-w-none break-words text-sm leading-6 text-white/80 sm:text-base">
            Create your account today and start ordering Rwanda's finest
            natural beverages. Fast delivery, easy checkout, and dedicated
            support.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-bold text-brand transition hover:bg-brand-soft"
            >
              Create Account
              <ChevronRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-white/40 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;