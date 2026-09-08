import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle2, Smartphone, MapPin, FileText } from "lucide-react";
import { useCart } from "../context/CartContext";

const STEPS = ["Delivery", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState({ name: "", phone: "", address: "", city: "", notes: "", date: "" });
  const [payment, setPayment] = useState({ method: "momo", momoNumber: "" });
  const [processing, setProcessing] = useState(false);

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    const newOrder = {
      id: `EX-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
      customer: delivery.name,
      email: delivery.phone,
      items: items.map(({ product, quantity }) => `${product.name} x ${quantity}`).join(", "),
      total: subtotal,
      paymentStatus: "Paid",
      status: "Processing",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const savedOrders = localStorage.getItem("exalto-admin-orders");
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    localStorage.setItem("exalto-admin-orders", JSON.stringify([...orders, newOrder]));
    setProcessing(false);
    clearCart?.();
    setStep(2);
  };

  if (items.length === 0 && step < 2) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-5 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#251c18]">Your cart is empty</h2>
          <p className="mt-2 text-sm text-[#77716d]">Add products before proceeding to checkout.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
            Browse Products <ChevronRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#9a8a82]">
          <Link to="/" className="hover:text-[#c94708]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-[#c94708]">Cart</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#c94708]">Checkout</span>
        </div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#c94708] text-white" : "border-2 border-[#eadfce] bg-white text-[#9a8a82]"}`}>
                {i < step ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`ml-2 text-xs font-semibold ${i === step ? "text-[#c94708]" : "text-[#9a8a82]"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`mx-4 h-px w-12 sm:w-20 ${i < step ? "bg-green-500" : "bg-[#eadfce]"}`} />}
            </div>
          ))}
        </div>

        {step === 2 ? (
          /* Confirmation */
          <div className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-black text-[#251c18]">Order Confirmed!</h2>
            <p className="mt-3 text-sm leading-6 text-[#77716d]">
              Thank you for your order. We've received your payment and will process your order shortly. You'll receive a confirmation notification.
            </p>
            <div className="mt-6 rounded-xl border border-green-200 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#77716d]">Order Summary</p>
              <p className="mt-2 text-sm font-semibold text-[#251c18]">Delivery to: {delivery.address}, {delivery.city}</p>
              <p className="text-sm text-[#77716d]">Contact: {delivery.phone}</p>
              <p className="mt-2 text-sm font-bold text-[#c94708]">Total Paid: Fr {subtotal.toLocaleString()}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/customer-dashboard" className="w-full bg-[#c94708] py-3 text-sm font-bold text-white hover:bg-[#9f3506] transition text-center">
                Track My Order
              </Link>
              <Link to="/shop" className="w-full border border-[#eadfce] py-3 text-sm font-bold text-[#251c18] hover:border-[#c94708] transition text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* Left: Forms */}
            <div>
              {step === 0 && (
                <form onSubmit={handleDeliverySubmit} className="rounded-2xl border border-[#eadfce] bg-white p-7 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c94708]/10">
                      <MapPin size={18} className="text-[#c94708]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#251c18]">Delivery Information</h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Full Name *</label>
                      <input required value={delivery.name} onChange={(e) => setDelivery({ ...delivery, name: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Phone Number *</label>
                      <input required value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="+250 7XX XXX XXX" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Delivery Address *</label>
                      <input required value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Street, neighbourhood" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">City / District *</label>
                      <input required value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="e.g. Kigali" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Preferred Delivery Date</label>
                      <input type="date" value={delivery.date} onChange={(e) => setDelivery({ ...delivery, date: e.target.value })} className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#3d291c]">Special Instructions</label>
                      <textarea rows={3} value={delivery.notes} onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })} className="w-full resize-none border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]" placeholder="Gate code, landmark, delivery instructions..." />
                    </div>
                  </div>
                  <button type="submit" className="mt-6 w-full bg-[#c94708] py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition">
                    Continue to Payment <ChevronRight size={16} className="inline" />
                  </button>
                </form>
              )}

              {step === 1 && (
                <form onSubmit={handlePaymentSubmit} className="rounded-2xl border border-[#eadfce] bg-white p-7 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c94708]/10">
                      <Smartphone size={18} className="text-[#c94708]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#251c18]">Payment</h2>
                  </div>

                  {/* Payment methods */}
                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { id: "momo", label: "Mobile Money", sub: "MTN MoMo / Airtel Money", icon: "📱" },
                      { id: "cod", label: "Cash on Delivery", sub: "Pay when you receive", icon: "💵" },
                    ].map(({ id, label, sub, icon }) => (
                      <label key={id} className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${payment.method === id ? "border-[#c94708] bg-[#c94708]/5" : "border-[#eadfce] hover:border-[#c94708]/40"}`}>
                        <input type="radio" name="method" value={id} checked={payment.method === id} onChange={() => setPayment({ ...payment, method: id })} className="sr-only" />
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-bold text-[#251c18]">{label}</p>
                          <p className="text-xs text-[#77716d]">{sub}</p>
                        </div>
                        <div className={`ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center ${payment.method === id ? "border-[#c94708]" : "border-[#ded5cd]"}`}>
                          {payment.method === id && <div className="h-2.5 w-2.5 rounded-full bg-[#c94708]" />}
                        </div>
                      </label>
                    ))}
                  </div>

                  {payment.method === "momo" && (
                    <div className="mb-5 rounded-xl border border-[#eadfce] bg-[#fffdf8] p-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#3d291c]">Paypack — Mobile Money</p>
                      <label className="mb-2 block text-xs font-semibold text-[#3d291c]">Mobile Money Number *</label>
                      <input
                        required={payment.method === "momo"}
                        value={payment.momoNumber}
                        onChange={(e) => setPayment({ ...payment, momoNumber: e.target.value })}
                        className="w-full border border-[#ded5cd] px-4 py-3 text-sm outline-none focus:border-[#c94708]"
                        placeholder="+250 7XX XXX XXX"
                      />
                      <p className="mt-3 text-xs text-[#77716d]">You will receive a payment prompt on your phone. Enter your PIN to confirm.</p>
                    </div>
                  )}

                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#eadfce] bg-[#f3efe9] p-4">
                    <FileText size={16} className="mt-0.5 flex-shrink-0 text-[#c94708]" />
                    <div>
                      <p className="text-xs font-bold text-[#251c18]">Delivery to: {delivery.address}, {delivery.city}</p>
                      <p className="text-xs text-[#77716d]">{delivery.name} · {delivery.phone}</p>
                    </div>
                    <button type="button" onClick={() => setStep(0)} className="ml-auto text-xs font-semibold text-[#c94708] hover:underline flex-shrink-0">Edit</button>
                  </div>

                  <button type="submit" disabled={processing} className="w-full bg-[#c94708] py-4 text-sm font-bold text-white hover:bg-[#9f3506] transition disabled:opacity-70">
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay Fr ${subtotal.toLocaleString()}`
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Order Summary */}
            <aside className="h-fit rounded-2xl border border-[#eadfce] bg-white p-6">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-[#251c18]">Order Summary</h3>
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#c94708] text-[10px] font-bold text-white">{quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-[#251c18]">{product.name}</p>
                      <p className="text-xs text-[#77716d]">Fr {product.price.toLocaleString()} each</p>
                    </div>
                    <p className="text-sm font-bold text-[#251c18]">Fr {(product.price * quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-[#eadfce] pt-4">
                <div className="flex justify-between text-sm"><span className="text-[#77716d]">Subtotal</span><span className="font-semibold">Fr {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#77716d]">Delivery</span><span className="font-semibold text-green-600">Free</span></div>
                <div className="flex justify-between border-t border-[#eadfce] pt-3 text-base font-black"><span>Total</span><span className="text-[#c94708]">Fr {subtotal.toLocaleString()}</span></div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
