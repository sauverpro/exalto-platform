import type { Product } from "../data/product";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { notify } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const favorited = isFavorite(product.id);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product);
    notify(`${product.name} added to cart`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    notify(
      favorited
        ? `${product.name} removed from favorites`
        : `${product.name} saved to favorites`,
      "favorite",
    );
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_14px_36px_rgba(31,107,69,0.13)]">
      {/* Image — fixed ratio so every card lines up regardless of source size */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-offwhite">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-navy px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Out of stock
            </span>
          </div>
        )}

        {/* Sits outside the Link so favouriting doesn't navigate away */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:bg-white"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
        >
          <Heart
            size={16}
            className={`transition ${
              favorited
                ? "fill-brand text-brand"
                : "text-concrete hover:text-brand"
            }`}
          />
        </button>
      </div>

      {/* Body — flex-1 + mt-auto keeps the buttons aligned across the row */}
      <div className="flex flex-1 flex-col p-4 text-left">
        <p className="text-[11px] font-medium uppercase tracking-wide text-concrete">
          {product.category}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-navy transition group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-black text-brand">
            Fr {product.price.toLocaleString()}
          </span>
          {product.unit && (
            <span className="text-[11px] text-concrete">/ {product.unit}</span>
          )}
        </div>

        {showDetails && (
          <p className="mt-3 border-t border-line pt-3 text-xs leading-5 text-concrete">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
          >
            <ShoppingCart size={14} />
            {outOfStock ? "Unavailable" : "Add to cart"}
          </button>

          <button
            type="button"
            onClick={() => setShowDetails((visible) => !visible)}
            aria-expanded={showDetails}
            className="rounded-lg border border-line px-3 py-2.5 text-[11px] font-medium text-concrete transition hover:border-brand hover:text-brand"
          >
            {showDetails ? "Less" : "Details"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
