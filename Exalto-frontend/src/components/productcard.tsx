import type { Product } from "../data/product";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showDetails, setShowDetails] = useState(false);
  const favorited = isFavorite(product.id);

  return (
    <article className="relative w-full overflow-hidden bg-white transition-all duration-300 hover:shadow-md">
      
      {/* Product Image */}
      <div className="relative h-[190px] w-full overflow-hidden bg-[#f8f5f1]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition hover:text-[#c94708]"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={18}
            className={`transition ${
              favorited
                ? "fill-[#c94708] text-[#c94708]"
                : "text-gray-400 hover:text-[#c94708]"
            }`}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="border-t border-[#f0e9e3] px-4 py-4 text-left">
        <h3 className="min-h-10 text-sm font-semibold leading-5 text-[#251c18]">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-[#9a8c83]">{product.category}</p>
        <p className="mt-2 font-semibold text-[#c7470b]">
          Fr {product.price.toLocaleString()}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-2 bg-[#c7470b] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#9f3506]"
          >
            <ShoppingCart size={14} /> Add to cart
          </button>

          <button
            type="button"
            onClick={() => setShowDetails((visible) => !visible)}
            className="border border-[#ded5cd] px-3 py-2 text-[10px] font-medium text-[#6f5a4d] transition hover:border-[#c94708] hover:text-[#c94708]"
          >
            Quick View
          </button>
        </div>
        {showDetails && <p className="mt-4 border-t border-[#eee8e2] pt-3 text-xs leading-5 text-[#77716d]">{product.description} Crafted for customers who value fresh, locally sourced flavour.</p>}
      </div>
    </article>
  );
};

export default ProductCard;
