import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ShoppingBag, Heart, FileText, MapPin, LogOut, ChevronRight, Package, Clock, CheckCircle2, Truck } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const NAV = [
  { id: "overview", icon: User, label: "My Account" },
  { id: "orders", icon: ShoppingBag, label: "Order History" },
  { id: "favorites", icon: Heart, label: "Saved Products" },
  { id: "addresses", icon: MapPin, label: "Addresses" },
  { id: "invoices", icon: FileText, label: "Invoices" },
] as const;

type Tab = (typeof NAV)[number]["id"];

const MOCK_ORDERS = [
  { id: "EX-2024-001", date: "Jan 15, 2025", items: "La Vie Passion Juice × 3", total: 27000, status: "Delivered" },
  { id: "EX-2024-002", date: "Jan 22, 2025", items: "Vicas Sugarcane Wine × 2", total: 24000, status: "Processing" },
  { id: "EX-2024-003", date: "Feb 1, 2025", items: "Passion Juice × 1, Sugarcane Wine × 1", total: 21000, status: "Pending Payment" },
];

const STATUS_STYLES: Record<string, string> = {
  "Delivered": "bg-green-50 text-green-700 border-green-200",
  "Processing": "bg-blue-50 text-blue-700 border-blue-200",
  "Pending Payment": "bg-amber-50 text-amber-700 border-amber-200",
  "Shipped": "bg-purple-50 text-purple-700 border-purple-200",
  "Cancelled": "bg-red-50 text-red-700 border-red-200",
};

const STATUS_ICONS: Record<string, typeof Package> = {
  "Delivered": CheckCircle2,
  "Processing": Package,
  "Pending Payment": Clock,
  "Shipped": Truck,
};

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { favorites } = useFavorites();

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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfce] text-[#77716d] hover:text-[#c94708] sm:hidden"
          >
            <User size={16} />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "flex" : "hidden"} sm:flex w-64 flex-shrink-0 flex-col border-r border-[#eadfce] bg-white min-h-[calc(100vh-64px)] sticky top-16 h-[calc(100vh-64px)]`}>
          {/* Profile */}
          <div className="border-b border-[#eadfce] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c94708]/10 text-lg font-black text-[#c94708]">J</div>
              <div>
                <p className="font-bold text-[#251c18]">Jean Doe</p>
                <p className="text-xs text-[#77716d]">client@exalto.com</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-4">
            {NAV.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === id ? "bg-[#c94708] text-white" : "text-[#6d6b69] hover:bg-[#f3efe9] hover:text-[#251c18]"}`}
              >
                <Icon size={17} className="flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <div className="border-t border-[#eadfce] p-4">
            <Link to="/" className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6d6b69] hover:bg-red-50 hover:text-red-500 transition">
              <LogOut size={17} />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 sm:p-8">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-[#251c18]">Welcome back, Jean 👋</h1>
                <p className="mt-1 text-sm text-[#77716d]">Here's a summary of your account activity.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Total Orders", value: MOCK_ORDERS.length, icon: ShoppingBag, color: "text-[#c94708] bg-[#c94708]/10" },
                  { label: "Delivered", value: MOCK_ORDERS.filter(o => o.status === "Delivered").length, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
                  { label: "Processing", value: MOCK_ORDERS.filter(o => o.status === "Processing").length, icon: Package, color: "text-blue-600 bg-blue-50" },
                  { label: "Saved Items", value: favorites.length, icon: Heart, color: "text-rose-500 bg-rose-50" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-2xl border border-[#eadfce] bg-white p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color.split(" ")[1]}`}>
                      <Icon size={18} className={color.split(" ")[0]} />
                    </div>
                    <p className="text-2xl font-black text-[#251c18]">{value}</p>
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
                <div className="space-y-3">
                  {MOCK_ORDERS.slice(0, 2).map((order) => {
                    const StatusIcon = STATUS_ICONS[order.status] ?? Package;
                    return (
                      <div key={order.id} className="flex items-center gap-4 rounded-xl border border-[#eadfce] p-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3efe9]">
                          <StatusIcon size={18} className="text-[#c94708]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#251c18]">{order.id}</p>
                          <p className="truncate text-xs text-[#77716d]">{order.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#c94708]">Fr {order.total.toLocaleString()}</p>
                          <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
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

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Order History</h1>
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.status] ?? Package;
                  return (
                    <div key={order.id} className="rounded-2xl border border-[#eadfce] bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#f3efe9]">
                            <StatusIcon size={20} className="text-[#c94708]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#251c18]">{order.id}</p>
                            <p className="text-xs text-[#77716d]">{order.date}</p>
                          </div>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                      </div>
                      <div className="mt-4 border-t border-[#eadfce] pt-4">
                        <p className="text-sm text-[#6d6b69]">{order.items}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-lg font-black text-[#c94708]">Fr {order.total.toLocaleString()}</p>
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-[#eadfce] px-4 py-2 text-xs font-semibold text-[#6d6b69] hover:border-[#c94708] hover:text-[#c94708] transition">
                              Download Invoice
                            </button>
                            {order.status === "Pending Payment" && (
                              <Link to="/checkout" className="rounded-lg bg-[#c94708] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9f3506] transition">
                                Pay Now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAVORITES */}
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
                    <div key={product.id} className="rounded-2xl border border-[#eadfce] bg-white overflow-hidden">
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

          {/* ADDRESSES */}
          {activeTab === "addresses" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Saved Addresses</h1>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-[#c94708] bg-white p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-[#c94708] px-3 py-1 text-[10px] font-bold text-white">Default</span>
                    <button className="text-xs font-semibold text-[#c94708] hover:underline">Edit</button>
                  </div>
                  <p className="font-bold text-[#251c18]">Jean Doe</p>
                  <p className="mt-1 text-sm text-[#77716d]">Kigali, Gasabo District</p>
                  <p className="text-sm text-[#77716d]">+250 788 000 000</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#eadfce] bg-white p-6 text-sm font-semibold text-[#9a8a82] hover:border-[#c94708] hover:text-[#c94708] transition">
                  + Add New Address
                </button>
              </div>
            </div>
          )}

          {/* INVOICES */}
          {activeTab === "invoices" && (
            <div>
              <h1 className="mb-6 text-2xl font-black text-[#251c18]">Invoices</h1>
              <div className="rounded-2xl border border-[#eadfce] bg-white overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#eadfce] bg-[#f3efe9]">
                      {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#77716d]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-[#eadfce] hover:bg-[#fffdf8]">
                        <td className="px-5 py-4 text-sm font-bold text-[#251c18]">{order.id}</td>
                        <td className="px-5 py-4 text-sm text-[#77716d]">{order.date}</td>
                        <td className="px-5 py-4 text-sm font-bold text-[#c94708]">Fr {order.total.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <button className="text-xs font-semibold text-[#c94708] hover:underline">Download PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
