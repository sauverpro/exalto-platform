import ProductCard from "../components/productcard";
import { products } from "../data/product";
import { useState } from "react";

const Shop = () => {
  const [query, setQuery] = useState("");
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="w-full bg-white">

      {/* =========================
          SHOP HERO
      ========================= */}
   
<section className="flex h-[170px] items-center justify-center bg-[#9b908e]">
  <div className="text-center text-white">
    <h1 className="text-2xl font-semibold">
      Shop
    </h1>

    <p className="mt-2 text-xs">
      Home / Shop
    </p>
  </div>
</section>



      {/* =========================
          PRODUCTS
      ========================= */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-6xl">

          {/* Results */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-500">Showing {filteredProducts.length} of {products.length} results</p>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="border border-[#ded5cd] bg-[#fffdf8] px-4 py-2 text-sm outline-none focus:border-[#c94708]" />
          </div>

          {/* Product Grid */}
          <div className="flex flex-wrap justify-center gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="py-12 text-center text-gray-500">No products match your search.</p>}

        </div>
      </section>

    </main>
  );
};

export default Shop;
