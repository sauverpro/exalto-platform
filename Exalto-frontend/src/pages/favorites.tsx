import { Link } from "react-router-dom";
import ProductCard from "../components/productcard";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-32 text-[#2a1f1a] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c94708]">Your collection</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Favorites</h1>

        {favorites.length === 0 ? (
          <section className="mt-12 border border-[#eadfce] bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">No favorites yet</h2>
            <p className="mx-auto mt-3 max-w-md text-[#77716d]">
              Start building your collection by adding items to your favorites!
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]"
            >
              Continue Shopping
            </Link>
          </section>
        ) : (
          <section className="mt-12">
            <p className="mb-8 text-sm text-gray-600">
              You have {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
