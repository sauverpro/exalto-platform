import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ChevronRight, Star, Package, Globe, Award, Minus, Plus, ArrowLeft } from "lucide-react";
import { products } from "../data/product";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/productcard";

type Tab = "description" | "details" | "shipping";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#251c18]">Product not found</h2>
          <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c94708] hover:underline">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] pb-20 pt-24 text-[#2a1f1a]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#9a8a82]">
          <Link to="/" className="hover:text-[#c94708]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#c94708]">Shop</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#c94708]">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#251c18]">{product.name}</span>
        </div>

        {/* Product layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-[420px] w-full object-cover sm:h-[520px]"
              />
              {product.exportAvailable && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#c94708] px-3 py-1.5 text-[10px] font-bold text-white">
                  <Globe size={11} /> Export Ready
                </span>
              )}
              <button
                onClick={() => toggleFavorite(product)}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition ${favorited ? "border-[#c94708] bg-[#c94708] text-white" : "border-[#eadfce] bg-white text-[#9a8a82] hover:border-[#c94708] hover:text-[#c94708]"}`}
              >
                <Heart size={18} className={favorited ? "fill-white" : ""} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${activeImage === i ? "border-[#c94708]" : "border-[#eadfce] hover:border-[#c94708]/50"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full border border-[#eadfce] bg-[#f3efe9] px-3 py-1 text-xs font-semibold text-[#77716d]">{product.category}</span>
              <span className="rounded-full border border-[#eadfce] bg-[#f3efe9] px-3 py-1 text-xs font-semibold text-[#77716d]">{product.grade}</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> In Stock
                </span>
              ) : (
                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Out of Stock</span>
              )}
            </div>

            <h1 className="text-3xl font-black text-[#251c18] sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-xs font-mono text-[#9a8a82]">{product.code}</p>

            <div className="mt-4 flex items-center gap-1">
              {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-[#c94708] text-[#c94708]" />)}
              <span className="ml-2 text-xs text-[#77716d]">(24 reviews)</span>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <p className="text-4xl font-black text-[#c94708]">Fr {product.price.toLocaleString()}</p>
              <p className="mb-1 text-sm text-[#9a8a82]">per {product.unit}</p>
            </div>

            <div className="mt-2 flex gap-4 text-xs text-[#77716d]">
              <span>Wholesale: <strong className="text-[#251c18]">Fr {product.wholesalePrice.toLocaleString()}</strong></span>
              <span>Export: <strong className="text-[#251c18]">Fr {product.exportPrice.toLocaleString()}</strong></span>
            </div>

            <div className="my-6 h-px bg-[#eadfce]" />

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { icon: Package, label: "Unit", value: product.unit },
                { icon: Award, label: "Grade", value: product.grade },
                { icon: Globe, label: "Origin", value: product.origin },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-[#eadfce] bg-white p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className="text-[#c94708]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a8a82]">{label}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#251c18]">{value}</p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-[#eadfce]" />

            {/* Quantity + Add to cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-[#ded5cd] rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-12 w-12 items-center justify-center text-[#251c18] hover:bg-[#f3efe9] transition">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex h-12 w-12 items-center justify-center text-[#251c18] hover:bg-[#f3efe9] transition">
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-bold text-white transition ${added ? "bg-green-500" : "bg-[#c94708] hover:bg-[#9f3506]"} disabled:opacity-50`}
              >
                <ShoppingCart size={18} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={() => { handleAddToCart(); navigate("/checkout"); }}
                className="flex-1 border-2 border-[#c94708] py-3.5 text-sm font-bold text-[#c94708] hover:bg-[#c94708] hover:text-white transition"
              >
                Buy Now
              </button>
            </div>

            <p className="mt-3 text-xs text-[#9a8a82]">{product.stock} units available · {product.packaging}</p>

            {product.exportAvailable && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4">
                <Globe size={18} className="flex-shrink-0 text-[#c94708]" />
                <div>
                  <p className="text-xs font-bold text-[#251c18]">Available for Export</p>
                  <p className="text-xs text-[#77716d]">This product ships internationally. <Link to="/export" className="font-semibold text-[#c94708] hover:underline">Request export quote →</Link></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-[#eadfce]">
            {(["description", "details", "shipping"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3.5 text-sm font-bold capitalize transition border-b-2 -mb-px ${tab === t ? "border-[#c94708] text-[#c94708]" : "border-transparent text-[#77716d] hover:text-[#251c18]"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="rounded-b-2xl border border-t-0 border-[#eadfce] bg-white p-8">
            {tab === "description" && (
              <div className="max-w-2xl">
                <p className="text-sm leading-8 text-[#6d6b69]">{product.description}</p>
                <ul className="mt-6 space-y-2">
                  {["100% natural, no artificial additives", "Cold-pressed to preserve nutrients", "Locally sourced from Rwandan farms", "Quality tested and certified"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#6d6b69]">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c94708]" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "details" && (
              <div className="max-w-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#eadfce]">
                    {[
                      ["Product Code", product.code],
                      ["Category", product.category],
                      ["Variety", product.variety],
                      ["Unit", product.unit],
                      ["Grade", product.grade],
                      ["Packaging", product.packaging],
                      ["Country of Origin", product.origin],
                      ["Export Available", product.exportAvailable ? "Yes" : "No"],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-3 pr-8 font-semibold text-[#251c18]">{label}</td>
                        <td className="py-3 text-[#6d6b69]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "shipping" && (
              <div className="max-w-2xl space-y-4 text-sm leading-7 text-[#6d6b69]">
                <p><strong className="text-[#251c18]">Local Delivery (Kigali):</strong> Same-day delivery for orders placed before 12:00 PM. Next-day delivery for orders placed after 12:00 PM.</p>
                <p><strong className="text-[#251c18]">Nationwide:</strong> 2–3 business days. Delivery fee calculated at checkout based on location.</p>
                <p><strong className="text-[#251c18]">Free Delivery:</strong> On all orders above Fr 20,000 within Kigali.</p>
                <p><strong className="text-[#251c18]">Export / International:</strong> 7–21 business days depending on destination. Full documentation provided. <Link to="/export" className="font-semibold text-[#c94708] hover:underline">Request export quote →</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-black text-[#251c18]">Related Products</h2>
              <Link to="/shop" className="text-sm font-bold text-[#c94708] hover:underline">View all</Link>
            </div>
            <div className="grid gap-px border border-[#eee8e2] bg-[#eee8e2] sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
