import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, ShoppingBag, Heart, FileText, MapPin, LogOut,
  ChevronRight, Package, Clock, CheckCircle2, Truck, Plus, Trash2, Star,
} from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
import {
  fetchOrders, fetchAddresses, createAddress, deleteAddress, setDefaultAddress,
  type Order, type Address,
} from "../api/customer";

const NAV = [
  { id: "overview",   icon: User,       label: "My Account"    },
  { id: "orders",     icon: ShoppingBag, label: "Order History" },
  { id: "favorites",  icon: Heart,       label: "Saved Products"},
  { id: "addresses",  icon: MapPin,      label: "Addresses"     },
  { id: "invoices",   icon: FileText,    label: "Invoices"      },
] as const;

type Tab = (typeof NAV)[number]["id"];

const STATUS_STYLE: Record<string, string> = {
  delivered:  "bg-green-50  text-green-700  border-green-200",
  processing: "bg-blue-50   text-blue-700   border-blue-200",
  pending:    "bg-amber-50  text-amber-700  border-amber-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  cancelled:  "bg-red-50    text-red-700    border-red-200",
};

const STATUS_ICON: Record<string, typeof Package> = {
  delivered: CheckCircle2,
  processing: Package,
  pending: Clock,
  shipped: Truck,
};

const EMPTY_ADDR = { full_name: "", phone_number: "", district: "", sector: "", street: "" };

export default function CustomerDashboard() {
  const [activeTab, setActiveTab]     = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders]           = useState<Order[]>([]);
  const [addresses, setAddresses]     = useState<Address[]>([]);
  const [ordersLoading, setOrdersLoading]     = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm]         = useState(EMPTY_ADDR);
  const [addrSaving, setAddrSaving]     = useState(false);
  const [addrError, setAddrError]       = useState("");

  const { favorites } = useFavorites();
  const { user, token, logout, isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  // Fetch orders
  useEffect(() => {
    if (!token) return;
    if (activeTab === "overview" || activeTab === "orders" || activeTab === "invoices") {
      setOrdersLoading(true);
      fetchOrders(token)
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, token]);

  // Fetch addresses
  useEffect(() => {
    if (!token) return;
    if (activeTab === "addresses") {
      setAddressesLoading(true);
      fetchAddresses(token)
        .then(setAddresses)
        .catch(() => setAddresses([]))
        .finally(() => setAddressesLoading(false));
    }
  }, [activeTab, token]);

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setAddrSaving(true);
    setAddrError("");
    try {
      const created = await createAddress(token, addrForm);
      setAddresses((prev) => [...prev, created]);
      setAddrForm(EMPTY_ADDR);
      setShowAddrForm(false);
    } catch (err: any) {
      const msg = err.response?.data?.errors;
      setAddrError(msg ? Object.values(msg).flat().join(" ") : "Failed to save address.");
    } finally {
      setAddrSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!token) return;
    await deleteAddress(token, id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: number) => {
    if (!token) return;
    await setDefaultAddress(token, id);
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
  };

  if (!user) return null;

  const firstName = user.full_name.split(" ")[0];
  const initials  = user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const countBy   = (s: string) => orders.filter((o) => o.status?.toLowerCase() === s).length;

  return (
    <div className="min-h-screen bg-[#fffdf8]">

      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eadfce] bg-white px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c94708]">
            <span className="text-sm font-black text-white">E</span>
          </div>
          <span className="font-black text-[#251c18]">EXALTO</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium text-[#77716d] hover:text-[#c94708] sm:flex">
            Continue Shopping <ChevronRight size={14} />
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfce] text-[#77716d] hover:text-[#c94708] sm:hidden">
            <User size={16} />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "flex" : "hidden"} sm:flex w-64 flex-shrink-0 flex-col border-r border-[#eadfce] bg-white min-h-[calc(100vh-64px)] sticky top-16 h-[calc(100vh-64px)]`}>
          <div className="border-b border-[#eadfce] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c94708]/10 text-lg font-black text-[#c94708]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#251c18]">{user.full_name}</p>
                <p className="truncate text-xs text-[#77716d]">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {NAV.map(({ id, icon: Icon, label }) => (
              <button key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === id ? "bg-[#c94708] text-white" : "text-[#6d6b69] hover:bg-[#f3efe9] hover:text-[#251c18]"}`}>
                <Icon size={17} className="flex-shrink-0" />{label}
              </button>
            ))}
          </nav>

          <div className="border-t border-[#eadfce] p-4">
            <button onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6d6b69] hover:bg-red-50 hover:text-red-500 transition">
              <LogOut size={17} />Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 sm:p-8">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-[#251c18]">Welcome back, {firstName} 👋</h1>
                <p className="mt-1 text-sm text-[#77716d]">Here's a summary of your account activity.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Total Orders",  value: orders.length,          icon: ShoppingBag,  color: "text-[#c94708] bg-[#c94708]/10" },
                  { label: "Delivered",     value: countBy("delivered"),   icon: CheckCircle2, color: "text-green-600 bg-green-50"     },
                  { label: "Processing",    value: countBy("processing"),  icon: Package,      color: "text-blue-600 bg-blue-50"       },
                  { label: "Saved Items",   value: favorites.length,       icon: Heart,        color: "text-rose-500 bg-rose-50"       },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-2xl border border-[#eadfce] bg-white p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color.split(" ")[1]}`}>
                      <Icon size={18} className={color.split(" ")[0]} />
                    </div>
                    <p className="text-2xl font-black text-[#251c18]">{ordersLoading ? "—" : value}</p>
                    <p className="text-xs text-[#77716d]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-[#eadfce] bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-[#251c18]">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-xs font-semibold text-[#c94708] hover:underline">View all</button>
                </div>
                {ordersLoading ? <p className="text-sm text-[#77716d]">Loading...</p>
                  : orders.length === 0 ? <p className="text-sm text-[#77716d]">No orders yet.</p>
                  : (
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((order) => {
                        const sk = order.status?.toLowerCase();
                        const Icon = STATUS_ICON[sk] ?? Package;
                        return (
                          <div key={order.id} className="flex items-center gap-4 rounded-xl border border-[#eadfce] p-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3efe9]">
                              <Icon size={18} className="text-[#c94708]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#251c18]">Order #{order.id}</p>
                              <p className="text-xs text-[#77716d]">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#c94708]">Fr {Number(order.total_amount).toLocaleString()}</p>
                              <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[sk] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/shop" className="flex items-center justify-between rounded-2xl border border-[#eadfce] bg-white p-5 hover:border-[#c94708] transition group">
                  <div>
                    <p className="font-bold text-[#251c18]">Browse Products</p>
                    <p className="text-xs text-[#77716d]">Discover our latest beverages</p>
                  </div>
                  <ChevronRight size={18} className="text-[#c94708] group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/wholesale" className="flex items-center justify-between rounded-2xl border border-[#eadfce] bg-white p-5 hover:border-[#c94708] transition group">
                  <div>
                    <p className="font-bold text-[#251c18]">Wholesale Account</p>
                    <p className="text-xs text-[#77716d]">Get bulk pricing for your business</p>
                  </div>
                  <ChevronRight size={18} className="text-[#c94708] group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Order History</h1>
              {ordersLoading ? <p className="text-sm text-[#77716d]">Loading orders...</p>
                : orders.length === 0 ? (
                  <div className="rounded-2xl border border-[#eadfce] bg-white p-12 text-center">
                    <ShoppingBag size={40} className="mx-auto text-[#eadfce]" />
                    <p className="mt-4 font-bold text-[#251c18]">No orders yet</p>
                    <p className="mt-1 text-sm text-[#77716d]">Start shopping to see your orders here.</p>
                    <Link to="/shop" className="mt-5 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
                      Browse Products <ChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const sk = order.status?.toLowerCase();
                      const Icon = STATUS_ICON[sk] ?? Package;
                      return (
                        <div key={order.id} className="rounded-2xl border border-[#eadfce] bg-white p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3efe9]">
                                <Icon size={20} className="text-[#c94708]" />
                              </div>
                              <div>
                                <p className="font-bold text-[#251c18]">Order #{order.id}</p>
                                <p className="text-xs text-[#77716d]">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[sk] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Order items */}
                          {order.order_items?.length > 0 && (
                            <div className="mt-4 space-y-2 border-t border-[#eadfce] pt-4">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-[#251c18]">{item.product?.name ?? `Product #${item.product_id}`} × {item.quantity}</span>
                                  <span className="font-semibold text-[#77716d]">Fr {(item.unit_price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 flex items-center justify-between border-t border-[#eadfce] pt-4">
                            <p className="text-lg font-black text-[#c94708]">Fr {Number(order.total_amount).toLocaleString()}</p>
                            {sk === "pending" && (
                              <Link to="/checkout" className="rounded-lg bg-[#c94708] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9f3506] transition">
                                Pay Now
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* ── FAVORITES ── */}
          {activeTab === "favorites" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Saved Products</h1>
              {favorites.length === 0 ? (
                <div className="rounded-2xl border border-[#eadfce] bg-white p-12 text-center">
                  <Heart size={40} className="mx-auto text-[#eadfce]" />
                  <p className="mt-4 font-bold text-[#251c18]">No saved products yet</p>
                  <p className="mt-1 text-sm text-[#77716d]">Browse our shop and save your favourite products.</p>
                  <Link to="/shop" className="mt-5 inline-flex items-center gap-2 bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#9f3506]">
                    Browse Products <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((product) => (
                    <div key={product.id} className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
                      <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                      <div className="p-4">
                        <p className="font-bold text-[#251c18]">{product.name}</p>
                        <p className="mt-1 text-sm font-bold text-[#c94708]">Fr {product.price.toLocaleString()}</p>
                        <Link to="/shop" className="mt-3 block w-full bg-[#c94708] py-2.5 text-center text-xs font-bold text-white hover:bg-[#9f3506] transition">
                          Add to Cart
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ADDRESSES ── */}
          {activeTab === "addresses" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-black text-[#251c18]">Saved Addresses</h1>
                <button onClick={() => setShowAddrForm((v) => !v)}
                  className="flex items-center gap-2 rounded-xl bg-[#c94708] px-4 py-2 text-sm font-bold text-white hover:bg-[#9f3506] transition">
                  <Plus size={15} /> Add Address
                </button>
              </div>

              {/* Add address form */}
              {showAddrForm && (
                <form onSubmit={handleAddAddress} className="mb-6 rounded-2xl border border-[#eadfce] bg-white p-6 space-y-4">
                  <h2 className="font-bold text-[#251c18]">New Address</h2>
                  {addrError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{addrError}</p>}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { key: "full_name",     label: "Full Name",     placeholder: "Your full name"   },
                      { key: "phone_number",  label: "Phone Number",  placeholder: "+250 7XX XXX XXX" },
                      { key: "district",      label: "District",      placeholder: "e.g. Gasabo"      },
                      { key: "sector",        label: "Sector",        placeholder: "e.g. Kimironko"   },
                      { key: "street",        label: "Street (optional)", placeholder: "Street address" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className={key === "street" ? "sm:col-span-2" : ""}>
                        <label className="mb-1 block text-xs font-semibold text-[#3d291c]">{label}</label>
                        <input
                          required={key !== "street"}
                          value={(addrForm as any)[key]}
                          onChange={(e) => setAddrForm((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-sm outline-none focus:border-[#c94708] focus:ring-2 focus:ring-[#c94708]/10"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={addrSaving}
                      className="rounded-xl bg-[#c94708] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#9f3506] disabled:opacity-60 transition">
                      {addrSaving ? "Saving..." : "Save Address"}
                    </button>
                    <button type="button" onClick={() => setShowAddrForm(false)}
                      className="rounded-xl border border-[#eadfce] px-6 py-2.5 text-sm font-semibold text-[#77716d] hover:border-[#c94708] transition">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addressesLoading ? <p className="text-sm text-[#77716d]">Loading addresses...</p>
                : addresses.length === 0 && !showAddrForm ? (
                  <div className="rounded-2xl border border-dashed border-[#eadfce] bg-white p-12 text-center">
                    <MapPin size={40} className="mx-auto text-[#eadfce]" />
                    <p className="mt-4 font-bold text-[#251c18]">No addresses saved</p>
                    <p className="mt-1 text-sm text-[#77716d]">Add a delivery address to speed up checkout.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`rounded-2xl border-2 bg-white p-6 ${addr.is_default ? "border-[#c94708]" : "border-[#eadfce]"}`}>
                        <div className="mb-3 flex items-center justify-between">
                          {addr.is_default
                            ? <span className="rounded-full bg-[#c94708] px-3 py-1 text-[10px] font-bold text-white">Default</span>
                            : <button onClick={() => handleSetDefault(addr.id)}
                                className="flex items-center gap-1 text-xs font-semibold text-[#77716d] hover:text-[#c94708] transition">
                                <Star size={12} /> Set default
                              </button>
                          }
                          <button onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[#77716d] hover:text-red-500 transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="font-bold text-[#251c18]">{addr.full_name}</p>
                        <p className="mt-1 text-sm text-[#77716d]">{addr.district}, {addr.sector}</p>
                        {addr.street && <p className="text-sm text-[#77716d]">{addr.street}</p>}
                        <p className="text-sm text-[#77716d]">{addr.phone_number}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── INVOICES ── */}
          {activeTab === "invoices" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Invoices</h1>
              {ordersLoading ? <p className="text-sm text-[#77716d]">Loading...</p>
                : orders.length === 0 ? <p className="text-sm text-[#77716d]">No invoices available.</p>
                : (
                  <div className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#eadfce] bg-[#f3efe9]">
                          {["Invoice", "Date", "Amount", "Status"].map((h) => (
                            <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#77716d]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const sk = order.status?.toLowerCase();
                          return (
                            <tr key={order.id} className="border-b border-[#eadfce] hover:bg-[#fffdf8]">
                              <td className="px-5 py-4 text-sm font-bold text-[#251c18]">#{order.id}</td>
                              <td className="px-5 py-4 text-sm text-[#77716d]">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-5 py-4 text-sm font-bold text-[#c94708]">Fr {Number(order.total_amount).toLocaleString()}</td>
                              <td className="px-5 py-4">
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[sk] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
