import { Link } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-32 text-[#2a1f1a] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-[#eee8e2] pb-6 text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c94708]">Your collection</p>
            <h1 className="mt-3 text-4xl font-black text-[#251c18] sm:text-5xl">Favorites</h1>
          </div>
          {favorites.length > 0 && <p className="text-sm text-[#77716d]">{favorites.length} saved item{favorites.length !== 1 ? "s" : ""}</p>}
        </div>

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
          <section className="overflow-x-auto border-y border-[#ded5cd] bg-white text-left">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[minmax(260px,2fr)_1fr_1.2fr_1fr_1.15fr_32px] items-center gap-4 border-b border-[#ded5cd] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b7c73]">
                <span>Product</span><span>Price</span><span>Date added</span><span>Stock</span><span>Add to cart</span><span />
              </div>
              {favorites.map((product) => (
                <div key={product.id} className="grid grid-cols-[minmax(260px,2fr)_1fr_1.2fr_1fr_1.15fr_32px] items-center gap-4 border-b border-[#eee8e2] px-5 py-4 last:border-b-0">
                  <div className="flex min-w-0 items-center gap-4">
                    <img src={product.image} alt={product.name} className="h-14 w-14 shrink-0 object-cover" />
                    <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-[#251c18]">{product.name}</h2><p className="mt-1 text-xs text-[#9a8c83]">{product.category}</p></div>
                  </div>
                  <p className="text-sm font-semibold text-[#251c18]">Fr {product.price.toLocaleString()}</p>
                  <p className="text-xs text-[#77716d]">Added recently</p>
                  <p className="text-xs font-medium text-[#77716d]"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#79b65b]" />In stock</p>
                  <button type="button" onClick={() => addToCart(product)} className="inline-flex w-fit items-center gap-2 bg-[#79b65b] px-5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#5e9945]"><ShoppingCart size={13} />Add to cart</button>
                  <button type="button" onClick={() => removeFavorite(product.id)} aria-label={`Remove ${product.name} from favorites`} className="justify-self-end p-1 text-lg font-semibold text-[#251c18] transition hover:text-[#c94708]"><X size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
