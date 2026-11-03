import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const formatPrice = (price: number) => `Fr ${price.toLocaleString()}`;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-offwhite px-5 pb-20 pt-32 text-navy sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Your order</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Shopping cart</h1>

        {items.length === 0 ? (
          <section className="mt-12 border border-line bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-concrete">Discover our natural Rwandan beverages and add your favourites here.</p>
            <Link to="/shop" className="mt-8 inline-flex bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark">Browse products</Link>
          </section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
            <section className="divide-y divide-line border border-line bg-white">
              {items.map(({ product, quantity }) => (
                <article key={product.id} className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                  <img src={product.image} alt={product.name} className="h-28 w-24 object-cover sm:h-36 sm:w-32" />
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div className="flex justify-between gap-3">
                      <div><h2 className="font-bold">{product.name}</h2><p className="mt-1 text-sm text-concrete">{formatPrice(product.price)} each</p></div>
                      <button type="button" onClick={() => { removeFromCart(product.id); notify(`${product.name} removed from cart`, "info"); }} aria-label={`Remove ${product.name}`} className="text-concrete hover:text-brand"><Trash2 size={18} /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Decrease quantity" className="p-2 hover:text-brand"><Minus size={15} /></button>
                        <span className="min-w-8 text-center text-sm">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity" className="p-2 hover:text-brand"><Plus size={15} /></button>
                      </div>
                      <strong>{formatPrice(product.price * quantity)}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <aside className="h-fit border border-line bg-brand-soft p-6">
              <h2 className="text-xl font-bold">Order summary</h2>
              <div className="mt-6 flex justify-between text-sm"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="mt-3 flex justify-between border-b border-line pb-5 text-sm"><span>Delivery</span><span>Calculated at checkout</span></div>
              <div className="mt-5 flex justify-between text-lg font-black"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              <button type="button" onClick={() => navigate("/checkout")} className="mt-7 w-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Proceed to checkout</button>
              <Link to="/shop" className="mt-4 block text-center text-sm font-semibold text-brand">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
