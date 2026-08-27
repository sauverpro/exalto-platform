import type { Product } from "../data/product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  return (
    <article className="w-full max-w-[280px] overflow-hidden border border-[#eee8e2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      
      {/* Product Image */}
      <div className="h-[220px] w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="px-4 py-4 text-center">
        <h3 className="text-sm font-semibold text-gray-800">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-gray-500">{product.category}</p>
        <p className="mt-2 font-semibold text-[#c7470b]">
          Fr {product.price.toLocaleString()}
        </p>
        <p className="mt-3 text-xs leading-5 text-gray-500">{product.description}</p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-2 rounded-full bg-[#c7470b] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#9f3506]"
          >
            <ShoppingCart size={14} /> Add to cart
          </button>

          <button
            type="button"
            onClick={() => setShowDetails((visible) => !visible)}
            className="rounded-full bg-[#c7470b] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#9f3506]"
          >
            Quick View
          </button>
        </div>
        {showDetails && <p className="mt-4 border-t border-[#eee8e2] pt-3 text-left text-xs leading-5 text-gray-600">{product.description} Crafted for customers who value fresh, locally sourced flavour.</p>}
      </div>
    </article>
  );
};

export default ProductCard;
