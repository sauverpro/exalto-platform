import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/productcard";
import { products, categories } from "../data/product";

const GRADES = ["All Grades", "Grade A", "Export Grade"];
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

export default function Shop() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [grade, setGrade] = useState("All Grades");
  const [maxPrice, setMaxPrice] = useState(120000);
  const [exportOnly, setExportOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = products
    .filter((p) =>
      (category === "All" || p.category === category) &&
      (grade === "All Grades" || p.grade === grade) &&
      p.price <= maxPrice &&
      (!exportOnly || p.exportAvailable) &&
      (!inStockOnly || p.stock > 0) &&
      `${p.name} ${p.category} ${p.variety}`.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      return b.id - a.id;
    });

  const clearFilters = () => {
    setQuery(""); setCategory("All"); setGrade("All Grades");
    setMaxPrice(120000); setExportOnly(false); setInStockOnly(false);
  };

  const hasFilters = category !== "All" || grade !== "All Grades" || maxPrice < 120000 || exportOnly || inStockOnly || query;

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#251c18]">

      {/* Hero banner */}
      <section
        className="flex min-h-[260px] items-center px-5 pb-10 pt-32 sm:px-8 lg:px-12"
        style={{
          backgroundImage: "linear-gradient(105deg, rgba(10,8,5,0.93) 0%, rgba(30,15,5,0.85) 60%, rgba(10,8,5,0.55) 100%), url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex items-center gap-2 mb-4 text-xs text-white/50">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="text-[#c94708]">›</span>
            <span className="font-semibold text-white">Shop</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c94708]">From Rwanda, with care</p>
          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">Our Products</h1>
          <p className="mt-3 max-w-lg text-sm text-white/60">Natural beverages crafted from Rwanda's finest ingredients. No additives, no compromise.</p>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[72px] sm:top-[88px] z-30 border-b border-[#eee8e2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${category === cat ? "bg-[#c94708] text-white" : "border border-[#eee8e2] text-[#77716d] hover:border-[#c94708] hover:text-[#c94708]"}`}
            >
              {cat}
              <span className="ml-1.5 opacity-60">
                ({cat === "All" ? products.length : products.filter((p) => p.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-[#c94708]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em]">Filters</h2>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs font-semibold text-[#c94708] hover:underline">Clear all</button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b9aaa1]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full border border-[#ded5cd] bg-[#fffdf8] pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#c94708]" />
              </div>

              {/* Grade */}
              <div className="border-t border-[#eee8e2] pt-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Quality Grade</h3>
                <div className="space-y-2.5">
                  {GRADES.map((g) => (
                    <label key={g} className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]">
                      <input type="radio" name="grade" checked={grade === g} onChange={() => setGrade(g)} className="h-4 w-4 accent-[#c94708]" />
                      <span className={grade === g ? "font-semibold text-[#c94708]" : ""}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-[#eee8e2] pt-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Max Price</h3>
                <input type="range" min="5000" max="120000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full cursor-pointer accent-[#c94708]" />
                <p className="mt-2 text-xs text-[#77716d]">Up to <span className="font-bold text-[#251c18]">Fr {maxPrice.toLocaleString()}</span></p>
              </div>

              {/* Checkboxes */}
              <div className="border-t border-[#eee8e2] pt-5 space-y-3">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Availability</h3>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-[#c94708]" />
                  In stock only
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]">
                  <input type="checkbox" checked={exportOnly} onChange={(e) => setExportOnly(e.target.checked)} className="h-4 w-4 accent-[#c94708]" />
                  Export available
                </label>
              </div>
            </div>
          </aside>

          {/* Products section */}
          <section className="min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-[#eee8e2] bg-white px-4 py-3">
              <p className="text-xs text-[#77716d]">
                Showing <span className="font-bold text-[#251c18]">{filtered.length}</span> of {products.length} products
                {hasFilters && <button onClick={clearFilters} className="ml-2 inline-flex items-center gap-1 text-[#c94708] hover:underline"><X size={11} />Clear filters</button>}
              </p>
              <div className="flex items-center gap-4">
                {/* Mobile filter toggle */}
                <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-1.5 text-xs font-semibold text-[#251c18] lg:hidden">
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <div className="flex items-center gap-2 text-xs text-[#77716d]">
                  <span>Sort:</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent font-semibold text-[#251c18] outline-none">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} />
                </div>
                <div className="hidden items-center gap-1 border-l border-[#eee8e2] pl-3 sm:flex">
                  <button onClick={() => setView("grid")} className={`p-1.5 ${view === "grid" ? "text-[#c94708]" : "text-[#b9aaa1]"}`}><Grid2X2 size={15} /></button>
                  <button onClick={() => setView("list")} className={`p-1.5 ${view === "list" ? "text-[#c94708]" : "text-[#b9aaa1]"}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="mb-5 rounded-xl border border-[#eee8e2] bg-white p-5 lg:hidden">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em]">Grade</h3>
                    <div className="flex flex-wrap gap-2">
                      {GRADES.map((g) => (
                        <button key={g} onClick={() => setGrade(g)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${grade === g ? "bg-[#c94708] text-white" : "border border-[#eee8e2] text-[#77716d]"}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em]">Max Price: Fr {maxPrice.toLocaleString()}</h3>
                    <input type="range" min="5000" max="120000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#c94708]" />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-[#c94708]" /> In stock</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={exportOnly} onChange={(e) => setExportOnly(e.target.checked)} className="accent-[#c94708]" /> Export</label>
                  </div>
                </div>
              </div>
            )}

            {/* Grid / List */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#eee8e2] bg-white py-20 text-center">
                <p className="text-lg font-bold text-[#251c18]">No products found</p>
                <p className="mt-2 text-sm text-[#77716d]">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="mt-4 text-sm font-bold text-[#c94708] hover:underline">Clear all filters</button>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-px border border-[#eee8e2] bg-[#eee8e2] sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-5 rounded-xl border border-[#eee8e2] bg-white p-4 hover:border-[#c94708]/40 transition">
                    <img src={p.image} alt={p.name} className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#251c18]">{p.name}</p>
                      <p className="text-xs text-[#77716d]">{p.category} · {p.unit} · {p.grade}</p>
                      <p className="mt-1 text-xs text-[#9a8a82] line-clamp-1">{p.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-[#c94708]">Fr {p.price.toLocaleString()}</p>
                      <p className="text-xs text-[#77716d]">{p.stock > 0 ? "In stock" : "Out of stock"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
