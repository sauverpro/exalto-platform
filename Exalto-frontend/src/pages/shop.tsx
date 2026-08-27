import { useState } from "react";
import { ChevronDown, Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/productcard";
import { products } from "../data/product";

const categories = ["All categories", "Juice", "Natural wine"];

const Shop = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortOrder, setSortOrder] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filteredProducts = products
    .filter((product) =>
      (selectedCategory === "All categories" || product.category === selectedCategory) &&
      product.price <= maxPrice &&
      `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((first, second) => sortOrder === "price-low" ? first.price - second.price : second.id - first.id);

  return (
    <main className="min-h-screen bg-[#fffdfb] text-[#251c18]">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-[#8b7c73]">
          <span>Home</span><span className="text-[#c94708]">›</span><span className="font-semibold text-[#c94708]">Shop</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="text-left">
            <div className="mb-8 flex items-center gap-2 border-b border-[#eee8e2] pb-4"><SlidersHorizontal size={16} className="text-[#c94708]" /><h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Shop filters</h2></div>
            <div className="mb-9"><h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]">Product categories</h3><div className="space-y-3">
              {categories.map((category) => <label key={category} className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]"><input type="radio" name="category" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} className="h-4 w-4 accent-[#c94708]" /><span className={selectedCategory === category ? "font-semibold text-[#c94708]" : ""}>{category}</span><span className="ml-auto text-xs text-[#b9aaa1]">{category === "All categories" ? products.length : products.filter((product) => product.category === category).length}</span></label>)}
            </div></div>
            <div className="mb-9 border-t border-[#eee8e2] pt-6"><h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]">Filter by price</h3><input type="range" min="0" max="20000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum product price" className="mb-3 h-1 w-full cursor-pointer accent-[#c94708]" /><p className="text-xs text-[#77716d]">Price: <span className="font-semibold text-[#251c18]">Fr 0 - Fr {maxPrice.toLocaleString()}</span></p></div>
            <div className="border-t border-[#eee8e2] pt-6"><h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]">Product status</h3><div className="space-y-3"><label className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]"><input type="checkbox" defaultChecked className="h-4 w-4 accent-[#c94708]" /> In stock</label><label className="flex cursor-pointer items-center gap-3 text-sm text-[#77716d]"><input type="checkbox" className="h-4 w-4 accent-[#c94708]" /> On sale</label></div></div>
          </aside>
          <section className="min-w-0">
            <div className="mb-5 border border-[#d9c6b8] bg-[#ead8ca] px-6 py-8 text-left sm:px-10 sm:py-10"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c94708]">From Rwanda, with care</p><h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[#3d291c] sm:text-4xl">Natural goodness for every day.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[#6f5a4d]">Discover bright fruit drinks and smooth natural wines made with locally sourced ingredients.</p><button type="button" onClick={() => setSelectedCategory("All categories")} className="mt-6 bg-[#c94708] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#9f3506]">Explore collection</button></div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-[#eee8e2] bg-white px-4 py-3"><p className="text-xs text-[#77716d]">Showing <span className="font-semibold text-[#251c18]">{filteredProducts.length}</span> of {products.length} results</p><div className="flex items-center gap-4"><label className="flex items-center gap-2 text-xs text-[#77716d]">Sort by<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="bg-transparent font-semibold text-[#251c18] outline-none"><option value="latest">Latest</option><option value="price-low">Price: low to high</option></select><ChevronDown size={13} /></label><div className="hidden items-center gap-1 border-l border-[#eee8e2] pl-4 sm:flex"><button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={`p-1.5 ${view === "grid" ? "text-[#c94708]" : "text-[#b9aaa1]"}`}><Grid2X2 size={16} /></button><button type="button" aria-label="List view" onClick={() => setView("list")} className={`p-1.5 ${view === "list" ? "text-[#c94708]" : "text-[#b9aaa1]"}`}><List size={17} /></button></div></div></div>
            <label className="mb-6 flex items-center border border-[#ded5cd] bg-white px-4 py-3 focus-within:border-[#c94708]"><Search size={16} className="mr-3 shrink-0 text-[#b9aaa1]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent text-sm outline-none placeholder:text-[#b9aaa1]" /></label>
            <div className={view === "grid" ? "grid gap-px border border-[#eee8e2] bg-[#eee8e2] sm:grid-cols-2" : "grid gap-4"}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}{filteredProducts.length === 0 && <p className="col-span-full bg-white py-16 text-center text-sm text-[#77716d]">No products match your search.</p>}</div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Shop;
