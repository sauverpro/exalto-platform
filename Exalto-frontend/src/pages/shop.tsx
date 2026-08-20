import ProductCard from "../components/productcard";
import { products } from "../data/product";

const Shop = () => {
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
          <p className="mb-5 text-xs text-gray-500">
            Showing all {products.length} results
          </p>

          {/* Product Grid */}
          <div className="flex flex-wrap justify-center gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </div>
      </section>

    </main>
  );
};

export default Shop;
