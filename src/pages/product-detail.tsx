import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ChevronRight, Star, Package, Globe, Award, Minus, Plus, ArrowLeft } from "lucide-react";
import { fetchStoreProducts } from "../api/products";
import type { Product } from "../data/product";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/productcard";

type Tab = "description" | "details" | "shipping";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    fetchStoreProducts().then(setProducts).catch(() => setLoadError("Product could not be loaded.")).finally(() => setLoading(false));
  }, []);
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [added, setAdded] = useState(false);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-offwhite pt-24 text-sm text-concrete">Loading product...</main>;
  if (loadError || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-offwhite pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-black text-navy">Product not found</h2>
          <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
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
    <main className="min-h-screen bg-offwhite pb-20 pt-24 text-navy">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-concrete">
          <Link to="/" className="hover:text-brand">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-brand">Shop</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-brand">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-navy">{product.name}</span>
        </div>

        {/* Product layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-[280px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              />
              {product.exportAvailable && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[10px] font-bold text-white">
                  <Globe size={11} /> Export Ready
                </span>
              )}
              <button
                onClick={() => toggleFavorite(product)}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition ${favorited ? "border-brand bg-brand text-white" : "border-line bg-white text-concrete hover:border-brand hover:text-brand"}`}
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
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${activeImage === i ? "border-brand" : "border-line hover:border-brand/50"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full border border-line bg-brand-soft px-3 py-1 text-xs font-semibold text-concrete">{product.category}</span>
              <span className="rounded-full border border-line bg-brand-soft px-3 py-1 text-xs font-semibold text-concrete">{product.grade}</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> In Stock
                </span>
              ) : (
                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Out of Stock</span>
              )}
            </div>

            <h1 className="text-3xl font-black text-navy sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-xs font-mono text-concrete">{product.code}</p>

            <div className="mt-4 flex items-center gap-1">
              {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-ochre text-ochre" />)}
              <span className="ml-2 text-xs text-concrete">(24 reviews)</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="text-3xl font-black text-brand sm:text-4xl">Fr {product.price.toLocaleString()}</p>
              <p className="mb-1 text-sm text-concrete">per {product.unit}</p>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-concrete">
              <span>Wholesale: <strong className="text-navy">Fr {product.wholesalePrice.toLocaleString()}</strong></span>
              <span>Export: <strong className="text-navy">Fr {product.exportPrice.toLocaleString()}</strong></span>
            </div>

            <div className="my-6 h-px bg-line" />

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { icon: Package, label: "Unit", value: product.unit },
                { icon: Award, label: "Grade", value: product.grade },
                { icon: Globe, label: "Origin", value: product.origin },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-line bg-white p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={13} className="text-brand" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-concrete">{label}</span>
                  </div>
                  <p className="text-xs font-semibold text-navy">{value}</p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-line" />

            {/* Quantity + Add to cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-line rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-12 w-12 items-center justify-center text-navy hover:bg-brand-soft transition">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex h-12 w-12 items-center justify-center text-navy hover:bg-brand-soft transition">
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex min-w-[150px] flex-1 items-center justify-center gap-2 py-3.5 text-sm font-bold text-white transition ${added ? "bg-green-500" : "bg-brand hover:bg-brand-dark"} disabled:opacity-50`}
              >
                <ShoppingCart size={18} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={() => { handleAddToCart(); navigate("/checkout"); }}
                className="min-w-[150px] flex-1 border-2 border-brand py-3.5 text-sm font-bold text-brand hover:bg-brand hover:text-white transition"
              >
                Buy Now
              </button>
            </div>

            <p className="mt-3 text-xs text-concrete">{product.stock} units available · {product.packaging}</p>

            {product.exportAvailable && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-brand-soft p-4">
                <Globe size={18} className="flex-shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-bold text-navy">Available for Export</p>
                  <p className="text-xs text-concrete">This product ships internationally. <Link to="/export" className="font-semibold text-brand hover:underline">Request export quote →</Link></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="flex overflow-x-auto border-b border-line">
            {(["description", "details", "shipping"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-shrink-0 px-4 py-3.5 text-sm font-bold capitalize transition border-b-2 -mb-px sm:px-6 ${tab === t ? "border-brand text-brand" : "border-transparent text-concrete hover:text-navy"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="rounded-b-2xl border border-t-0 border-line bg-white p-5 sm:p-8">
            {tab === "description" && (
              <div className="max-w-2xl">
                <p className="text-sm leading-8 text-concrete">{product.description}</p>
                <ul className="mt-6 space-y-2">
                  {["100% natural, no artificial additives", "Cold-pressed to preserve nutrients", "Locally sourced from Rwandan farms", "Quality tested and certified"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-concrete">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "details" && (
              <div className="max-w-lg">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-line">
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
                        <td className="py-3 pr-4 font-semibold text-navy sm:pr-8">{label}</td>
                        <td className="py-3 text-concrete">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "shipping" && (
              <div className="max-w-2xl space-y-4 text-sm leading-7 text-concrete">
                <p><strong className="text-navy">Local Delivery (Kigali):</strong> Same-day delivery for orders placed before 12:00 PM. Next-day delivery for orders placed after 12:00 PM.</p>
                <p><strong className="text-navy">Nationwide:</strong> 2–3 business days. Delivery fee calculated at checkout based on location.</p>
                <p><strong className="text-navy">Free Delivery:</strong> On all orders above Fr 20,000 within Kigali.</p>
                <p><strong className="text-navy">Export / International:</strong> 7–21 business days depending on destination. Full documentation provided. <Link to="/export" className="font-semibold text-brand hover:underline">Request export quote →</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl font-black text-navy sm:text-2xl">Related Products</h2>
              <Link to="/shop" className="text-sm font-bold text-brand hover:underline">View all</Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
