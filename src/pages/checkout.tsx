import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle2,
  Smartphone,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import {
  createAddress,
  createOrder,
  createOrderItem,
  createPayment,
  fetchAddresses,
} from "../api/customer";

const STEPS = ["Delivery", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token } = useUser();

  const [step, setStep] = useState(0);

  const [delivery, setDelivery] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    sector: "",
    notes: "",
    date: "",
  });

  const [payment, setPayment] = useState({
    method: "momo",
    momoNumber: "",
  });

  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);

  // Delivery is currently free. Annotated as `number` rather than letting it
  // infer the literal type `0`, which would narrow every `shippingFee === 0`
  // check's else-branch to `never`.
  const shippingFee: number = 0;

  // This is the exact amount that will be stored on the order
  // and used for payment.
  const orderTotal = subtotal + shippingFee;

  // ─────────────────────────────────────────────────────────────────────────
  // Prefill delivery information from user's saved address
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const applyUserFallback = () => {
      setDelivery((prev) => ({
        ...prev,
        name: prev.name || user.full_name || "",
        phone: prev.phone || user.phone_number || "",
      }));
    };

    if (!token) {
      applyUserFallback();
      return;
    }

    fetchAddresses(token)
      .then((addresses) => {
        const defaultAddress =
          addresses.find((address) => address.is_default) ?? addresses[0];

        if (defaultAddress) {
          setDelivery((prev) => ({
            ...prev,
            name: prev.name || defaultAddress.full_name || "",
            phone: prev.phone || defaultAddress.phone_number || "",
            address: prev.address || defaultAddress.street || "",
            city: prev.city || defaultAddress.district || "",
            sector: prev.sector || defaultAddress.sector || "",
          }));
        } else {
          applyUserFallback();
        }
      })
      .catch(() => {
        applyUserFallback();
      });
  }, [user, token]);

  // ─────────────────────────────────────────────────────────────────────────
  // Delivery form
  // ─────────────────────────────────────────────────────────────────────────
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setCheckoutError("");

    if (!user || !token) {
      setCheckoutError("Please sign in to complete your order.");
      return;
    }

    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setStep(1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Payment / Order submission
  //
  // Flow:
  // 1. Create address
  // 2. Create order WITH subtotal + shipping_fee + total
  // 3. Create all order items
  // 4. Create payment using the same order total
  // 5. Show confirmation
  // ─────────────────────────────────────────────────────────────────────────
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCheckoutError("");

    if (!token || !user) {
      setCheckoutError("Please sign in to complete your order.");
      return;
    }

    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (payment.method === "momo" && !payment.momoNumber.trim()) {
      setCheckoutError(
        "Enter the mobile money number you will pay from.",
      );
      return;
    }

    if (orderTotal <= 0) {
      setCheckoutError("Your order total must be greater than zero.");
      return;
    }

    setProcessing(true);

    try {
      // ─────────────────────────────────────────────────────────────────────
      // 1. CREATE DELIVERY ADDRESS
      // ─────────────────────────────────────────────────────────────────────
      const address = await createAddress(token, {
        full_name: delivery.name.trim(),
        phone_number: delivery.phone.trim(),
        district: delivery.city.trim(),
        sector: delivery.sector.trim(),
        street: delivery.address.trim(),
      });

      if (!address?.id) {
        throw new Error("The delivery address could not be created.");
      }

      // ─────────────────────────────────────────────────────────────────────
      // 2. CREATE ORDER
      //
      // IMPORTANT:
      // subtotal and total are required by your orders table.
      // ─────────────────────────────────────────────────────────────────────
      const order = await createOrder(token, {
        address_id: address.id,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total: orderTotal,
        currency: "RWF",
        notes: delivery.notes.trim() || "Payment",
      });

      if (!order?.id) {
        throw new Error("The order could not be created.");
      }

      // ─────────────────────────────────────────────────────────────────────
      // 3. CREATE ORDER ITEMS
      // ─────────────────────────────────────────────────────────────────────
      for (const { product, quantity } of items) {
        await createOrderItem(token, {
          order_id: order.id,
          product_id: product.id,
          quantity,
        });
      }

      // ─────────────────────────────────────────────────────────────────────
      // 4. CREATE PAYMENT
      //
      // Use the exact same total that was stored on the order.
      // ─────────────────────────────────────────────────────────────────────
      const paymentMethod =
        payment.method === "momo" ? "mobile_money" : "cash";

      await createPayment(token, {
        order_id: order.id,
        amount: order.total ?? orderTotal,
        currency: "RWF",
        method: paymentMethod,
        status: "pending",
      });

      // ─────────────────────────────────────────────────────────────────────
      // 5. SUCCESS
      // ─────────────────────────────────────────────────────────────────────
      const finalTotal = order.total ?? orderTotal;

      setPlacedOrderId(order.id);
      setPlacedOrderTotal(finalTotal);

      clearCart();
      setStep(2);
    } catch (error: any) {
      console.error("Checkout error:", error);

      const data = error?.response?.data;

      const validationErrors = data?.errors;

      const validationMessage = validationErrors
        ? Object.values(validationErrors)
            .flat()
            .join(" ")
        : "";

      const message =
        validationMessage ||
        (typeof data?.message === "string" ? data.message : "") ||
        error?.message ||
        "We could not complete your order. Please try again.";

      setCheckoutError(message);
    } finally {
      setProcessing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Empty cart
  // ─────────────────────────────────────────────────────────────────────────
  if (items.length === 0 && step < 2) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-offwhite px-5 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-concrete">
            Add products before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            Browse Products
            <ChevronRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-offwhite px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-concrete">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>

          <ChevronRight size={12} />

          <Link to="/cart" className="hover:text-brand">
            Cart
          </Link>

          <ChevronRight size={12} />

          <span className="font-semibold text-brand">
            Checkout
          </span>
        </div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {STEPS.map((stepName, index) => (
            <div
              key={stepName}
              className="flex items-center"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                  index < step
                    ? "bg-green-500 text-white"
                    : index === step
                      ? "bg-brand text-white"
                      : "border-2 border-line bg-white text-concrete"
                }`}
              >
                {index < step ? (
                  <CheckCircle2 size={18} />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={`ml-2 text-xs font-semibold ${
                  index === step
                    ? "text-brand"
                    : "hidden text-concrete sm:inline"
                }`}
              >
                {stepName}
              </span>

              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-px w-6 sm:mx-4 sm:w-20 ${
                    index < step
                      ? "bg-green-500"
                      : "bg-line"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CONFIRMATION
        ─────────────────────────────────────────────────────────────────── */}
        {step === 2 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={40}
                className="text-green-500"
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-navy">
              Order Confirmed!
            </h2>

            <p className="mt-3 text-sm leading-6 text-concrete">
              Your order has been placed successfully.
              We will process your order shortly.
            </p>

            <div className="mt-6 rounded-xl border border-green-200 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-concrete">
                Order Summary
              </p>

              {placedOrderId !== null && (
                <p className="mt-2 text-sm font-semibold text-navy">
                  Order #{placedOrderId}
                </p>
              )}

              <p className="mt-2 text-sm font-semibold text-navy">
                Delivery to: {delivery.address}, {delivery.city}
              </p>

              <p className="text-sm text-concrete">
                Contact: {delivery.phone}
              </p>

              <p className="mt-2 text-sm font-bold text-brand">
                Total: Fr {placedOrderTotal.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-concrete">
                Payment status: Pending
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/customer-dashboard"
                className="w-full bg-brand py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                Track My Order
              </Link>

              <Link
                to="/shop"
                className="w-full border border-line py-3 text-center text-sm font-bold text-navy transition hover:border-brand"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* ───────────────────────────────────────────────────────────────
                LEFT: FORMS
            ─────────────────────────────────────────────────────────────── */}
            <div>

              {/* DELIVERY */}
              {step === 0 && (
                <form
                  onSubmit={handleDeliverySubmit}
                  className="rounded-2xl border border-line bg-white p-5 sm:p-8"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                      <MapPin
                        size={18}
                        className="text-brand"
                      />
                    </div>

                    <h2 className="text-lg font-bold text-navy">
                      Delivery Information
                    </h2>
                  </div>

                  {!user && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <AlertCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />

                      <div>
                        You need an account to place an order.{" "}

                        <Link
                          to="/login"
                          className="font-bold text-brand underline"
                        >
                          Sign in
                        </Link>{" "}

                        or{" "}

                        <Link
                          to="/register"
                          className="font-bold text-brand underline"
                        >
                          create one
                        </Link>
                        .
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Full Name
                      </label>

                      <input
                        required
                        value={delivery.name}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Phone Number
                      </label>

                      <input
                        required
                        value={delivery.phone}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="+250 7XX XXX XXX"
                      />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Delivery Address
                      </label>

                      <input
                        required
                        value={delivery.address}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            address: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="Street, neighbourhood"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        City / District
                      </label>

                      <input
                        required
                        value={delivery.city}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            city: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="e.g. Kigali"
                      />
                    </div>

                    {/* Sector */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Sector
                      </label>

                      <input
                        required
                        value={delivery.sector}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            sector: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="e.g. Remera, Kacyiru"
                      />
                    </div>

                    {/* Delivery Date */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Preferred Delivery Date
                      </label>

                      <input
                        type="date"
                        value={delivery.date}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            date: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                      />
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-navy">
                        Special Instructions
                      </label>

                      <textarea
                        rows={3}
                        value={delivery.notes}
                        onChange={(e) =>
                          setDelivery({
                            ...delivery,
                            notes: e.target.value,
                          })
                        }
                        className="w-full resize-none border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="Gate code, landmark, delivery instructions..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!user || !token}
                    className="mt-6 w-full bg-brand py-4 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Continue to Payment{" "}
                    <ChevronRight
                      size={16}
                      className="inline"
                    />
                  </button>
                </form>
              )}

              {/* PAYMENT */}
              {step === 1 && (
                <form
                  onSubmit={handlePaymentSubmit}
                  className="rounded-2xl border border-line bg-white p-5 sm:p-8"
                >

                  {/* Error */}
                  {checkoutError && (
                    <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      <AlertCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />

                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                      <Smartphone
                        size={18}
                        className="text-brand"
                      />
                    </div>

                    <h2 className="text-lg font-bold text-navy">
                      Payment
                    </h2>
                  </div>

                  {/* Payment methods */}
                  <div className="mb-6 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        id: "momo",
                        label: "Mobile Money",
                        sub: "MTN MoMo / Airtel Money",
                        icon: "📱",
                      },
                      {
                        id: "cod",
                        label: "Cash on Delivery",
                        sub: "Pay when you receive",
                        icon: "💵",
                      },
                    ].map(
                      ({
                        id,
                        label,
                        sub,
                        icon,
                      }) => (
                        <label
                          key={id}
                          className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${
                            payment.method === id
                              ? "border-brand bg-brand/5"
                              : "border-line hover:border-brand/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={id}
                            checked={
                              payment.method === id
                            }
                            onChange={() =>
                              setPayment({
                                ...payment,
                                method: id,
                              })
                            }
                            className="sr-only"
                          />

                          <span className="text-2xl">
                            {icon}
                          </span>

                          <div>
                            <p className="text-sm font-bold text-navy">
                              {label}
                            </p>

                            <p className="text-xs text-concrete">
                              {sub}
                            </p>
                          </div>

                          <div
                            className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              payment.method === id
                                ? "border-brand"
                                : "border-line"
                            }`}
                          >
                            {payment.method === id && (
                              <div className="h-2.5 w-2.5 rounded-full bg-brand" />
                            )}
                          </div>
                        </label>
                      ),
                    )}
                  </div>

                  {/* Mobile Money */}
                  {payment.method === "momo" && (
                    <div className="mb-5 rounded-xl border border-line bg-offwhite p-5">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-navy">
                        Paypack — Mobile Money
                      </p>

                      <label className="mb-2 block text-xs font-semibold text-navy">
                        Mobile Money Number *
                      </label>

                      <input
                        required={
                          payment.method === "momo"
                        }
                        value={payment.momoNumber}
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            momoNumber: e.target.value,
                          })
                        }
                        className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-brand"
                        placeholder="+250 7XX XXX XXX"
                      />

                      <p className="mt-3 text-xs text-concrete">
                        You will receive a payment prompt on
                        your phone. Enter your PIN to confirm.
                      </p>
                    </div>
                  )}

                  {/* Delivery summary */}
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-line bg-brand-soft p-4">
                    <FileText
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-brand"
                    />

                    <div>
                      <p className="text-xs font-bold text-navy">
                        Delivery to: {delivery.address},{" "}
                        {delivery.city}
                      </p>

                      <p className="text-xs text-concrete">
                        {delivery.name} · {delivery.phone}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="ml-auto flex-shrink-0 text-xs font-semibold text-brand hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Amount */}
                  <div className="mb-5 rounded-xl border border-line bg-offwhite p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-concrete">
                        Amount to pay
                      </span>

                      <span className="text-lg font-black text-brand">
                        Fr {orderTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-brand py-4 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing Order...
                      </span>
                    ) : (
                      `Pay Fr ${orderTotal.toLocaleString()}`
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────────────
                RIGHT: ORDER SUMMARY
            ─────────────────────────────────────────────────────────────── */}
            <aside className="h-fit rounded-2xl border border-line bg-white p-6">

              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-navy">
                Order Summary
              </h3>

              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-soft text-xs text-concrete">
                          No image
                        </div>
                      )}

                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                        {quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">
                        {product.name}
                      </p>

                      <p className="text-xs text-concrete">
                        Fr {product.price.toLocaleString()} each
                      </p>
                    </div>

                    <p className="text-sm font-bold text-navy">
                      Fr{" "}
                      {(
                        product.price * quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-line pt-4">

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-concrete">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    Fr {subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm">
                  <span className="text-concrete">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    {shippingFee === 0
                      ? "Free"
                      : `Fr ${shippingFee.toLocaleString()}`}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-line pt-3 text-base font-black">
                  <span>Total</span>

                  <span className="text-brand">
                    Fr {orderTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
