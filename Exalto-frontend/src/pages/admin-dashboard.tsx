import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Menu, X, BarChart3, ShoppingBag, Users, Settings,
  TrendingUp, Package, Bell, ChevronRight, Edit2, Trash2, Sun, Moon,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { products, type Product } from "../data/product";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", id: "overview" },
  { icon: ShoppingBag, label: "Products", id: "products" },
  { icon: Users, label: "Orders", id: "orders" },
  { icon: Settings, label: "Settings", id: "settings" },
] as const;

type Tab = (typeof NAV_ITEMS)[number]["id"];

type OrderStatus = "Pending Payment" | "Paid" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: string;
  total: number;
  paymentStatus: "Pending" | "Paid";
  status: OrderStatus;
  date: string;
}

const ORDER_STATUSES: OrderStatus[] = ["Pending Payment", "Paid", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];

const INITIAL_ORDERS: AdminOrder[] = [
  { id: "EX-2026-001", customer: "Jean Doe", email: "jean@example.com", items: "La Vie Passion Juice x 3", total: 27000, paymentStatus: "Paid", status: "Processing", date: "Sep 8, 2026" },
  { id: "EX-2026-002", customer: "Sarah Kim", email: "sarah@example.com", items: "Vicas Sugarcane Wine x 2", total: 24000, paymentStatus: "Pending", status: "Pending Payment", date: "Sep 7, 2026" },
  { id: "EX-2026-003", customer: "David Niyonzima", email: "david@example.com", items: "Passion Juice Export Carton x 1", total: 95000, paymentStatus: "Paid", status: "Shipped", date: "Sep 5, 2026" },
];

const STATS = [
  { label: "Total Revenue", value: "Fr 21,000", change: "+12%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Total Products", value: "2", change: "+1", icon: Package, color: "text-[#c94708]", bg: "bg-[#c94708]/10" },
  { label: "Total Orders", value: "2", change: "+2", icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Customers", value: "18", change: "+5%", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
];

export default function AdminDashboard() {
  const { isAdminLoggedIn, adminEmail, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lightMode, setLightMode] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>(products);
  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const savedOrders = localStorage.getItem("exalto-admin-orders");
      return savedOrders ? JSON.parse(savedOrders) as AdminOrder[] : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [orderSearch, setOrderSearch] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Juice",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem("exalto-admin-orders", JSON.stringify(orders));
  }, [orders]);

  if (!isAdminLoggedIn) {
    navigate("/admin-login");
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  const openProductForm = (product?: Product) => {
    setEditingProduct(product ?? null);
    setProductForm(product
      ? {
          name: product.name,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          description: product.description,
          image: product.image,
        }
      : {
          name: "",
          category: "Juice",
          price: "",
          stock: "",
          description: "",
          image: products[0]?.image ?? "",
        });
    setProductModalOpen(true);
  };

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    if (!productForm.name.trim() || !price || stock < 0) return;

    if (editingProduct) {
      setAdminProducts((current) => current.map((product) => product.id === editingProduct.id
        ? { ...product, ...productForm, price, stock, name: productForm.name.trim() }
        : product));
    } else {
      const id = Math.max(0, ...adminProducts.map((product) => product.id)) + 1;
      setAdminProducts((current) => [...current, {
        ...products[0],
        id,
        code: `EX-CUSTOM-${id}`,
        name: productForm.name.trim(),
        category: productForm.category,
        price,
        wholesalePrice: price,
        exportPrice: price,
        stock,
        description: productForm.description,
        image: productForm.image || products[0].image,
        images: [productForm.image || products[0].image],
        featured: false,
      }]);
    }
    setProductModalOpen(false);
  };

  const deleteProduct = (productId: number) => {
    if (window.confirm("Delete this product from the admin list?")) {
      setAdminProducts((current) => current.filter((product) => product.id !== productId));
    }
  };

  const visibleProducts = adminProducts.filter((product) =>
    `${product.name} ${product.category} ${product.code}`.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const visibleOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.email} ${order.items} ${order.status}`.toLowerCase().includes(orderSearch.toLowerCase()),
  );

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === orderId
      ? { ...order, status, paymentStatus: status === "Pending Payment" ? "Pending" : "Paid" }
      : order));
  };

  return (
    <div className={`admin-dashboard flex min-h-screen bg-[#0d0906] text-white ${lightMode ? "admin-light" : ""}`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-[72px]"} fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#1e1410] bg-[#0f0a08] transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#1e1410] px-5">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c94708]">
                <span className="text-sm font-black text-white">E</span>
              </div>
              <span className="text-base font-black tracking-wide text-white">EXALTO</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b5e58] hover:bg-[#1e1410] hover:text-white transition"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV_ITEMS.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={!sidebarOpen ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activeTab === id
                  ? "bg-[#c94708] text-white shadow-[0_4px_20px_rgba(201,71,8,0.4)]"
                  : "text-[#6b5e58] hover:bg-[#1e1410] hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-[#1e1410] px-3 py-4 space-y-1">
          {sidebarOpen && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#1a1008] px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c94708]/20 text-[#c94708] text-xs font-bold">
                {adminEmail?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{adminEmail}</p>
                <p className="text-[10px] text-[#4a3d38]">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6b5e58] hover:bg-red-950/40 hover:text-red-400 transition"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-[72px]"} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1e1410] bg-[#0f0a08]/95 px-8 backdrop-blur">
          <div>
            <h2 className="text-lg font-bold text-white">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-[#4a3d38]">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLightMode(!lightMode)}
              aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"}
              title={lightMode ? "Dark mode" : "Light mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] hover:text-white transition"
            >
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] hover:text-white transition">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c94708]" />
            </button>
            <a
              href="/"
              className="flex items-center gap-2 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2 text-xs font-medium text-[#6b5e58] hover:text-white transition"
            >
              View Store <ChevronRight size={14} />
            </a>
          </div>
        </header>

        <div className="p-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
                  <div key={label} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#4a3d38]">{label}</p>
                        <p className="mt-3 text-3xl font-black text-white">{value}</p>
                        <p className={`mt-1 text-xs font-semibold ${color}`}>{change} this month</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                        <Icon size={20} className={color} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured products preview */}
              <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Featured Products</h3>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="flex items-center gap-1 text-xs font-medium text-[#c94708] hover:underline"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {adminProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 rounded-xl border border-[#1e1410] bg-[#1a1008] p-4">
                      <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-[#4a3d38]">{p.category}</p>
                        <p className="mt-1 text-sm font-bold text-[#c94708]">Fr {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "New order received", detail: "La Vie Passion Juice × 2", time: "2 min ago", dot: "bg-emerald-400" },
                    { action: "Product viewed", detail: "Vicas Sugarcane Wine", time: "15 min ago", dot: "bg-blue-400" },
                    { action: "Admin login", detail: adminEmail ?? "", time: "Just now", dot: "bg-[#c94708]" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{item.action}</p>
                        <p className="text-xs text-[#4a3d38]">{item.detail}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-[#3d3028]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#1e1410] px-6 py-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">All Products</h3>
                <button onClick={() => openProductForm()} className="flex items-center gap-2 rounded-xl bg-[#c94708] px-4 py-2 text-xs font-bold text-white hover:bg-[#a83906] transition shadow-[0_4px_15px_rgba(201,71,8,0.3)]">
                  + Add Product
                </button>
              </div>
              <div className="border-b border-[#1e1410] px-6 py-4">
                <input
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2.5 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708] sm:max-w-sm"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1e1410]">
                      {["Product", "Category", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((p) => (
                      <tr key={p.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                            <span className="text-sm font-semibold text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full border border-[#2a1f1a] bg-[#1a1008] px-3 py-1 text-xs font-medium text-[#6b5e58]">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {p.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> In Stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openProductForm(p)} aria-label={`Edit ${p.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e1410] text-[#6b5e58] hover:border-[#c94708] hover:text-[#c94708] transition">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} aria-label={`Delete ${p.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e1410] text-[#6b5e58] hover:border-red-800 hover:text-red-400 transition">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleProducts.length === 0 && <p className="px-6 py-10 text-center text-sm text-[#6b5e58]">No products match your search.</p>}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e1410] px-6 py-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Order Management</h3>
                  <p className="mt-1 text-xs text-[#4a3d38]">{orders.length} customer orders</p>
                </div>
                <input
                  value={orderSearch}
                  onChange={(event) => setOrderSearch(event.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2.5 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708] sm:max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-[#1e1410]">
                      {["Order", "Customer", "Total", "Payment", "Delivery Status", "Date"].map((heading) => (
                        <th key={heading} className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white">{order.id}</p>
                          <p className="mt-1 text-xs text-[#4a3d38]">{order.items}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-white">{order.customer}</p>
                          <p className="mt-1 text-xs text-[#4a3d38]">{order.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === "Paid" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(event) => updateOrderStatus(order.id, event.target.value as OrderStatus)}
                            className="rounded-lg border border-[#1e1410] bg-[#1a1008] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[#c94708]"
                          >
                            {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#6b5e58]">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleOrders.length === 0 && <p className="px-6 py-10 text-center text-sm text-[#6b5e58]">No orders match your search.</p>}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-xl space-y-6">
              <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4a3d38]">Admin Email</label>
                    <input
                      type="email"
                      value={adminEmail ?? ""}
                      disabled
                      className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-[#6b5e58] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4a3d38]">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white placeholder-[#3d3028] outline-none transition focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/50"
                    />
                  </div>
                  <button className="rounded-xl bg-[#c94708] px-6 py-3 text-sm font-bold text-white hover:bg-[#a83906] transition shadow-[0_4px_15px_rgba(201,71,8,0.3)]">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-white">Danger Zone</h3>
                <p className="mb-4 text-xs text-[#4a3d38]">These actions are irreversible. Please proceed with caution.</p>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-3 text-sm font-bold text-red-400 hover:bg-red-950/60 transition"
                >
                  Sign Out of Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {productModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 py-8">
          <form onSubmit={saveProduct} className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button type="button" onClick={() => setProductModalOpen(false)} aria-label="Close product form" className="text-[#6b5e58] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-[#6b5e58]">Product name
                <input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
              </label>
              <label className="text-xs font-semibold text-[#6b5e58]">Category
                <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]">
                  <option>Juice</option>
                  <option>Natural Wine</option>
                  <option>Gift Sets</option>
                  <option>Export Produce</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-[#6b5e58]">Price
                <input required min="1" type="number" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
              </label>
              <label className="text-xs font-semibold text-[#6b5e58]">Stock quantity
                <input required min="0" type="number" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
              </label>
              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">Image URL
                <input value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
              </label>
              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">Description
                <textarea rows={4} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setProductModalOpen(false)} className="rounded-xl border border-[#1e1410] px-5 py-3 text-sm font-semibold text-[#6b5e58] hover:text-white">Cancel</button>
              <button type="submit" className="rounded-xl bg-[#c94708] px-5 py-3 text-sm font-bold text-white hover:bg-[#a83906]">Save Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
