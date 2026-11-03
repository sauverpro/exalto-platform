import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/productcard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { fetchStoreProducts } from "../api/products";
import type { Product } from "../data/product";

const GRADES = ["All Grades", "Grade A", "Export Grade"];
const PAGE_SIZE = 12;

/** Page buttons with ellipsis, so long lists stay to one row. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push("gap");

  pages.push(total);
  return pages;
}

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [grade, setGrade] = useState("All Grades");
  const [maxPrice, setMaxPrice] = useState(120000);
  const [exportOnly, setExportOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStoreProducts().then(setProducts).catch(() => setLoadError("Products could not be loaded.")).finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Clamp rather than trust `page`: narrowing the filters can drop the total
  // below the current page before the reset effect below runs.
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // Any change to the result set sends you back to the first page.
  useEffect(() => {
    setPage(1);
  }, [query, category, grade, maxPrice, exportOnly, inStockOnly, sortOrder]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setQuery(""); setCategory("All"); setGrade("All Grades");
    setMaxPrice(120000); setExportOnly(false); setInStockOnly(false);
  };

  const hasFilters = category !== "All" || grade !== "All Grades" || maxPrice < 120000 || exportOnly || inStockOnly || query;

  return (
    <main className="min-h-screen bg-offwhite text-navy">

      {/* Search header */}
      <div className="border-b border-line bg-white px-5 pt-28 pb-6 sm:px-8 lg:px-12">
        {/* text-left is explicit: #root sets `text-align: center` globally. */}
        <div className="mx-auto max-w-[1400px] text-left">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-concrete">
            <Link to="/" className="hover:text-brand">Home</Link>
            <span className="text-brand">›</span>
            <span className="font-semibold text-navy">Shop</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-navy sm:text-3xl">Our Products</h1>
                <p className="mt-1 text-sm text-concrete">{products.length} products available</p>
            </div>
            <label className="flex w-full max-w-md items-center gap-3 border border-line bg-offwhite px-4 py-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition">
              <Search size={18} className="flex-shrink-0 text-concrete" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products by name, category..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-concrete"
              />
              {query && (
                <button onClick={() => setQuery("")} className="flex-shrink-0 text-concrete hover:text-brand">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-[72px] sm:top-[88px] z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${category === cat ? "bg-brand text-white" : "border border-line text-concrete hover:border-brand hover:text-brand"}`}
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
                  <SlidersHorizontal size={15} className="text-brand" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em]">Filters</h2>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs font-semibold text-brand hover:underline">Clear all</button>
                )}
              </div>

              {/* Grade */}
              <div className="border-t border-line pt-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Quality Grade</h3>
                <div className="space-y-2.5">
                  {GRADES.map((g) => (
                    <label key={g} className="flex cursor-pointer items-center gap-3 text-sm text-concrete">
                      <input type="radio" name="grade" checked={grade === g} onChange={() => setGrade(g)} className="h-4 w-4 accent-brand" />
                      <span className={grade === g ? "font-semibold text-brand" : ""}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-line pt-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Max Price</h3>
                <input type="range" min="5000" max="120000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full cursor-pointer accent-brand" />
                <p className="mt-2 text-xs text-concrete">Up to <span className="font-bold text-navy">Fr {maxPrice.toLocaleString()}</span></p>
              </div>

              {/* Checkboxes */}
              <div className="border-t border-line pt-5 space-y-3">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">Availability</h3>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-concrete">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-brand" />
                  In stock only
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-concrete">
                  <input type="checkbox" checked={exportOnly} onChange={(e) => setExportOnly(e.target.checked)} className="h-4 w-4 accent-brand" />
                  Export available
                </label>
              </div>
            </div>
          </aside>

          {/* Products section */}
          <section className="min-w-0">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-line bg-white px-4 py-3">
              <p className="text-xs text-concrete">
                Showing{" "}
                <span className="font-bold text-navy">
                  {filtered.length === 0 ? 0 : pageStart + 1}–{pageStart + visible.length}
                </span>{" "}
                of {filtered.length} products
                {hasFilters && <button onClick={clearFilters} className="ml-2 inline-flex items-center gap-1 text-brand hover:underline"><X size={11} />Clear filters</button>}
              </p>
              <div className="flex items-center gap-4">
                {/* Mobile filter toggle */}
                <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-1.5 text-xs font-semibold text-navy lg:hidden">
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <div className="flex items-center gap-2 text-xs text-concrete">
                  <span>Sort:</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent font-semibold text-navy outline-none">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} />
                </div>
                <div className="hidden items-center gap-1 border-l border-line pl-3 sm:flex">
                  <button onClick={() => setView("grid")} className={`p-1.5 ${view === "grid" ? "text-brand" : "text-concrete"}`}><Grid2X2 size={15} /></button>
                  <button onClick={() => setView("list")} className={`p-1.5 ${view === "list" ? "text-brand" : "text-concrete"}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {filtersOpen && (
              <div className="mb-5 rounded-xl border border-line bg-white p-5 lg:hidden">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em]">Grade</h3>
                    <div className="flex flex-wrap gap-2">
                      {GRADES.map((g) => (
                        <button key={g} onClick={() => setGrade(g)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${grade === g ? "bg-brand text-white" : "border border-line text-concrete"}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em]">Max Price: Fr {maxPrice.toLocaleString()}</h3>
                    <input type="range" min="5000" max="120000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand" />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-brand" /> In stock</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={exportOnly} onChange={(e) => setExportOnly(e.target.checked)} className="accent-brand" /> Export</label>
                  </div>
                </div>
              </div>
            )}

            {/* Grid / List */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            )}
            {loadError && <p className="py-16 text-center text-sm text-red-600">{loadError}</p>}
            {!loading && !loadError && (
              filtered.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white py-20 text-center">
                <p className="text-lg font-bold text-navy">No products found</p>
                <p className="mt-2 text-sm text-concrete">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="mt-4 text-sm font-bold text-brand hover:underline">Clear all filters</button>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {visible.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 hover:border-brand/40 transition sm:gap-5 sm:p-4">
                    <img src={p.image} alt={p.name} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover sm:h-20 sm:w-20" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-navy sm:text-base">{p.name}</p>
                      <p className="truncate text-xs text-concrete">{p.category} · {p.unit} · {p.grade}</p>
                      <p className="mt-1 hidden text-xs text-concrete line-clamp-1 sm:block">{p.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-brand sm:text-lg">Fr {p.price.toLocaleString()}</p>
                      <p className="text-[10px] text-concrete sm:text-xs">{p.stock > 0 ? "In stock" : "Out of stock"}</p>
                    </div>
                  </Link>
                ))}
              </div>
              )
            )}

            {/* Pagination */}
            {!loading && !loadError && totalPages > 1 && (
              <nav
                aria-label="Product pages"
                className="mt-8 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-navy transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-navy"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageWindow(currentPage, totalPages).map((entry, index) =>
                  entry === "gap" ? (
                    <span
                      key={`gap-${index}`}
                      className="px-1 text-xs text-concrete"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={entry}
                      onClick={() => goToPage(entry)}
                      aria-current={entry === currentPage ? "page" : undefined}
                      className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-bold transition ${
                        entry === currentPage
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-navy hover:border-brand hover:text-brand"
                      }`}
                    >
                      {entry}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 items-center gap-1 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-navy transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-navy"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={14} />
                </button>
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
