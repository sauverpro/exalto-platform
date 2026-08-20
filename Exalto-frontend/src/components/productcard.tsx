import type { Product } from "../data/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="w-full max-w-[260px] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      
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

        <p className="mt-1 text-xs text-gray-500">
          R {product.price.toLocaleString()}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            className="rounded-full bg-[#c7470b] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#9f3506]"
          >
            Add to cart
          </button>

          <button
            className="rounded-full bg-[#c7470b] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#9f3506]"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
