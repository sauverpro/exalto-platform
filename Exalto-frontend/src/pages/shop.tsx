import ProductCard from "../components/productcard";
import { products } from "../data/product";
import { Search } from "lucide-react";
import { useState } from "react";

const Shop = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryDetails: Record<string, string> = {
    Juice: "Bright, refreshing fruit drinks made with locally sourced ingredients.",
    "Natural wine": "Smooth, vibrant wines crafted from Rwanda's finest natural produce.",
  };
  const categories = ["All", ...Object.keys(categoryDetails)];
  const filteredProducts = products.filter((product) =>
    (selectedCategory === "All" || product.category === selectedCategory) &&
      `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="w-full bg-[#fffdfb]">

        {/* products */}

 <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 border-b border-[#eee8e2] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c7470b]">Find your favourite</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#251c18] sm:text-3xl">Shop our collection</h2>
            </div>
            <label className="flex w-full max-w-xs items-center border border-[#ded5cd] bg-white px-4 py-2.5 focus-within:border-[#c94708]">
              <Search size={16} className="mr-3 shrink-0 text-[#c8bbb2]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent text-sm text-[#251c18] outline-none placeholder:text-[#b9aaa1]" />
            </label>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between text-left">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#251c18]">Categories</h3>
              <p className="text-xs text-gray-500">{filteredProducts.length} of {products.length} products</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
            {categories.map((category) => {
              const categoryCount = category === "All"
                ? products.length
                : products.filter((product) => product.category === category).length;
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`border p-4 text-left transition ${isSelected ? "border-[#c94708] bg-[#fff7f0] shadow-sm" : "border-[#eee8e2] bg-white hover:border-[#c94708]"}`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-800">{category}</span>
                    <span className="text-xs text-[#c7470b]">{categoryCount} {categoryCount === 1 ? "item" : "items"}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    {category === "All" ? "Explore the complete Exalto collection." : categoryDetails[category]}
                  </p>
                </button>
              );
            })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="col-span-full py-12 text-center text-gray-500">No products match your search.</p>}

        </div>
      </section>

    </main>
  );
};

export default Shop;
