import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Menu, X, BarChart3, ShoppingBag, Users, Settings,
  TrendingUp, Package, Bell, ChevronRight, Edit2, Trash2, Sun, Moon, FileText, Globe2, Search, Image, LayoutTemplate, Save, Upload, Trash,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { products, type Product } from "../data/product";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", id: "overview" },
  { icon: ShoppingBag, label: "Products", id: "products" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: FileText, label: "Quotations", id: "quotations" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: LayoutTemplate, label: "CMS Screens", id: "cms" },
  { icon: Image, label: "Media Library", id: "media" },
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

interface AdminCustomer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  orders: number;
  spending: number;
  status: "Active" | "Pending";
}

interface ExportQuotation {
  id: string;
  company: string;
  country: string;
  products: string;
  quantity: string;
  schedule: string;
  status: "New" | "Reviewing" | "Quoted" | "Accepted" | "Declined";
  date: string;
}

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: "image";
}

const INITIAL_CUSTOMERS: AdminCustomer[] = [
  { id: "CUS-001", name: "Jean Doe", company: "Kigali Foods Ltd", email: "jean@example.com", phone: "+250 788 111 222", orders: 8, spending: 216000, status: "Active" },
  { id: "CUS-002", name: "Sarah Kim", company: "Green Basket Market", email: "sarah@example.com", phone: "+250 788 333 444", orders: 5, spending: 145000, status: "Active" },
  { id: "CUS-003", name: "David Niyonzima", company: "Niyo Imports", email: "david@example.com", phone: "+250 788 555 666", orders: 2, spending: 190000, status: "Pending" },
];

const INITIAL_QUOTATIONS: ExportQuotation[] = [
  { id: "QUO-2026-001", company: "Niyo Imports", country: "Kenya", products: "Passion Juice Export Carton", quantity: "100 cartons", schedule: "October 2026", status: "New", date: "Sep 8, 2026" },
  { id: "QUO-2026-002", company: "Mara Retail Group", country: "UAE", products: "Sugarcane Wine, Passion Juice", quantity: "500 cartons", schedule: "November 2026", status: "Reviewing", date: "Sep 6, 2026" },
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
  const [customers] = useState<AdminCustomer[]>(INITIAL_CUSTOMERS);
  const [customerSearch, setCustomerSearch] = useState("");
  const [quotations, setQuotations] = useState<ExportQuotation[]>(() => {
    try {
      const savedQuotations = localStorage.getItem("exalto-admin-quotations");
      return savedQuotations ? JSON.parse(savedQuotations) as ExportQuotation[] : INITIAL_QUOTATIONS;
    } catch {
      return INITIAL_QUOTATIONS;
    }
  });
  const [quotationSearch, setQuotationSearch] = useState("");
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const savedMedia = localStorage.getItem("exalto-admin-media");
      return savedMedia ? JSON.parse(savedMedia) as MediaAsset[] : [];
    } catch {
      return [];
    }
  });
  const [mediaUrl, setMediaUrl] = useState("");
  const [cmsPage, setCmsPage] = useState<"home" | "about" | "contact" | "wholesale" | "export">("home");
  const [cmsOpenSections, setCmsOpenSections] = useState<Record<string, boolean>>({ navbar: true, hero: true });
  const toggleCmsSection = (key: string) => setCmsOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const [cmsContent, setCmsContent] = useState(() => {
    try {
      const savedCms = localStorage.getItem("exalto-admin-cms");
      return savedCms ? JSON.parse(savedCms) : {
        // Navbar
        navLinks: ["Home", "Shop", "About", "Wholesale", "Export", "Contact"],
        navCta: "Order Now",
        // Home – Hero
        heroTitle: "EXALTO FRESH PRODUCE",
        heroSubtitle: "Premium natural beverages and fresh produce from Rwanda's finest farms. Supplying local businesses, wholesale buyers, and international export partners.",
        heroBtn1: "Shop Now",
        heroBtn2: "Wholesale Enquiry",
        heroStat1Val: "500+", heroStat1Label: "Happy Clients",
        heroStat2Val: "100%", heroStat2Label: "Natural",
        heroStat3Val: "2+", heroStat3Label: "Products",
        heroStat4Val: "Rwanda", heroStat4Label: "Origin",
        // Home – Announcement
        announcementText: "Free delivery on orders in Kigali · Export inquiries welcome",
        announcementLink: "Open a wholesale account →",
        // Home – Categories section
        categoriesHeading: "Shop Our Range",
        categoriesSubheading: "Browse by Category",
        // Home – Features
        featuresHeading: "",
        feature1Title: "100% Natural", feature1Desc: "No artificial additives. Pure ingredients from Rwanda's finest farms.",
        feature2Title: "Quality Certified", feature2Desc: "Every batch tested and certified to meet international standards.",
        feature3Title: "Fast Delivery", feature3Desc: "Same-day delivery in Kigali. Nationwide and export shipping available.",
        feature4Title: "Premium Grade", feature4Desc: "Only Grade A produce selected for our beverages and export catalog.",
        // Home – Featured Products
        productsHeading: "Featured Products",
        productsSubheading: "Fresh & Natural",
        // Home – Wholesale Banner
        wholesaleBannerTag: "For Business Buyers",
        wholesaleBannerTitle: "Wholesale & Export Solutions",
        wholesaleBannerDesc: "We supply restaurants, hotels, supermarkets, and international distributors with premium Rwandan beverages.",
        wholesaleBannerBtn1: "Open Wholesale Account",
        wholesaleBannerBtn2: "Export Enquiry",
        // Home – Testimonials
        testimonialsHeading: "Trusted by Businesses",
        testimonialsSubheading: "What Our Clients Say",
        testimonial1Name: "Jean-Pierre M.", testimonial1Role: "Restaurant Owner, Kigali", testimonial1Text: "Exalto's passion juice is the best we've served. Our customers always ask for more.",
        testimonial2Name: "Sarah K.", testimonial2Role: "Wholesale Buyer", testimonial2Text: "Reliable supply, great pricing, and the team is always responsive.",
        testimonial3Name: "David N.", testimonial3Role: "Export Partner, Nairobi", testimonial3Text: "The sugarcane wine has been a hit in our market. Packaging is excellent.",
        // Home – CTA
        ctaTitle: "Ready to Order?",
        ctaDescription: "Create your account today and start ordering Rwanda's finest natural beverages.",
        ctaBtn1: "Create Account",
        ctaBtn2: "Browse Products",
        // About
        aboutIntro: "We transform Rwanda's finest ingredients into premium natural beverages.",
        aboutMission: "To deliver the purest, most natural beverages from Rwanda to the world.",
        // Contact
        contactHeading: "Get in Touch",
        contactSubheading: "We're here to help",
        contactIntro: "Have a question, want to place a bulk order, or just want to say hello?",
        // Wholesale
        wholesaleHeading: "Wholesale Partnership",
        wholesaleIntro: "Join our growing network of wholesale partners across Rwanda and beyond.",
        // Export
        exportHeading: "Export Solutions",
        exportIntro: "We export premium Rwandan beverages to markets across Africa and beyond.",
      };
    } catch {
      return { heroTitle: "EXALTO FRESH PRODUCE", heroSubtitle: "", ctaTitle: "Ready to Order?", ctaDescription: "", navLinks: ["Home","Shop","About","Wholesale","Export","Contact"], navCta: "Order Now" };
    }
  });
  const [adminSettings, setAdminSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("exalto-admin-settings");
      return savedSettings ? JSON.parse(savedSettings) : { companyName: "Exalto Engineering & Supply Solutions Ltd", currency: "RWF", hours: "Mon - Sun: 8:00 AM - 9:00 PM", emailNotifications: true };
    } catch {
      return { companyName: "Exalto Engineering & Supply Solutions Ltd", currency: "RWF", hours: "Mon - Sun: 8:00 AM - 9:00 PM", emailNotifications: true };
    }
  });
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

  useEffect(() => {
    localStorage.setItem("exalto-admin-quotations", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem("exalto-admin-media", JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    localStorage.setItem("exalto-admin-cms", JSON.stringify(cmsContent));
  }, [cmsContent]);

  useEffect(() => {
    localStorage.setItem("exalto-admin-settings", JSON.stringify(adminSettings));
  }, [adminSettings]);

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

  const visibleCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.company} ${customer.email} ${customer.phone}`.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  const visibleQuotations = quotations.filter((quotation) =>
    `${quotation.id} ${quotation.company} ${quotation.country} ${quotation.products} ${quotation.status}`.toLowerCase().includes(quotationSearch.toLowerCase()),
  );

  const updateQuotationStatus = (quotationId: string, status: ExportQuotation["status"]) => {
    setQuotations((current) => current.map((quotation) => quotation.id === quotationId ? { ...quotation, status } : quotation));
  };

  const addMediaAsset = (url: string, name: string) => {
    if (!url.trim()) return;
    setMediaAssets((current) => [...current, { id: `MED-${Date.now()}`, name: name || "Uploaded image", url, type: "image" }]);
    setMediaUrl("");
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") addMediaAsset(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((total, order) => total + order.total, 0);
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
  const pendingOrders = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;

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

          {/* CUSTOMERS */}
          {activeTab === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e1410] px-6 py-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Customer Management</h3>
                  <p className="mt-1 text-xs text-[#4a3d38]">{customers.length} registered clients</p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3d38]" />
                  <input value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Search customers..." className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead><tr className="border-b border-[#1e1410]">
                    {["Customer", "Company", "Contact", "Orders", "Total Spending", "Status"].map((heading) => <th key={heading} className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">{heading}</th>)}
                  </tr></thead>
                  <tbody>{visibleCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-white">{customer.name}</p><p className="mt-1 text-xs text-[#4a3d38]">{customer.id}</p></td>
                      <td className="px-6 py-4 text-sm text-[#6b5e58]">{customer.company}</td>
                      <td className="px-6 py-4"><p className="text-xs text-white">{customer.email}</p><p className="mt-1 text-xs text-[#4a3d38]">{customer.phone}</p></td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{customer.orders}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {customer.spending.toLocaleString()}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${customer.status === "Active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{customer.status}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {visibleCustomers.length === 0 && <p className="px-6 py-10 text-center text-sm text-[#6b5e58]">No customers match your search.</p>}
            </div>
          )}

          {/* QUOTATIONS */}
          {activeTab === "quotations" && (
            <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e1410] px-6 py-5">
                <div><h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">Export Quotations</h3><p className="mt-1 text-xs text-[#4a3d38]">Review and track international business requests</p></div>
                <div className="relative w-full sm:max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3d38]" /><input value={quotationSearch} onChange={(event) => setQuotationSearch(event.target.value)} placeholder="Search quotations..." className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708]" /></div>
              </div>
              <div className="overflow-x-auto"><table className="w-full min-w-[950px]"><thead><tr className="border-b border-[#1e1410]">
                {["Quotation", "Company", "Destination", "Products", "Quantity", "Status", "Date"].map((heading) => <th key={heading} className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">{heading}</th>)}
              </tr></thead><tbody>{visibleQuotations.map((quotation) => (
                <tr key={quotation.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                  <td className="px-6 py-4"><p className="text-sm font-bold text-white">{quotation.id}</p><p className="mt-1 text-xs text-[#4a3d38]">{quotation.schedule}</p></td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">{quotation.company}</td>
                  <td className="px-6 py-4"><span className="flex items-center gap-2 text-sm text-[#6b5e58]"><Globe2 size={14} className="text-[#c94708]" />{quotation.country}</span></td>
                  <td className="max-w-xs px-6 py-4 text-xs text-[#6b5e58]">{quotation.products}</td>
                  <td className="px-6 py-4 text-sm text-white">{quotation.quantity}</td>
                  <td className="px-6 py-4"><select value={quotation.status} onChange={(event) => updateQuotationStatus(quotation.id, event.target.value as ExportQuotation["status"])} className="rounded-lg border border-[#1e1410] bg-[#1a1008] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[#c94708]"><option>New</option><option>Reviewing</option><option>Quoted</option><option>Accepted</option><option>Declined</option></select></td>
                  <td className="px-6 py-4 text-xs text-[#6b5e58]">{quotation.date}</td>
                </tr>
              ))}</tbody></table></div>
              {visibleQuotations.length === 0 && <p className="px-6 py-10 text-center text-sm text-[#6b5e58]">No quotations match your search.</p>}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div><h3 className="text-xl font-bold text-white">Sales Analytics</h3><p className="mt-1 text-sm text-[#4a3d38]">A frontend preview of your store performance.</p></div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Paid Revenue", `Fr ${revenue.toLocaleString()}`, "text-emerald-400"],
                  ["Total Orders", String(orders.length), "text-blue-400"],
                  ["Pending Orders", String(pendingOrders), "text-amber-400"],
                  ["Delivered Orders", String(deliveredOrders), "text-[#c94708]"],
                ].map(([label, value, color]) => <div key={label} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6"><p className="text-xs uppercase tracking-[0.12em] text-[#4a3d38]">{label}</p><p className={`mt-3 text-3xl font-black ${color}`}>{value}</p></div>)}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6"><h4 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Order Status</h4>{ORDER_STATUSES.map((status) => { const count = orders.filter((order) => order.status === status).length; return <div key={status} className="mb-4"><div className="mb-2 flex justify-between text-xs"><span className="text-[#6b5e58]">{status}</span><span className="font-bold text-white">{count}</span></div><div className="h-2 rounded-full bg-[#1a1008]"><div className="h-2 rounded-full bg-[#c94708] transition-all" style={{ width: `${orders.length ? (count / orders.length) * 100 : 0}%` }} /></div></div>; })}</div>
                <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6"><h4 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Inventory Snapshot</h4>{adminProducts.slice(0, 5).map((product) => <div key={product.id} className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-white">{product.name}</p><p className="text-xs text-[#4a3d38]">{product.category}</p></div><span className={`text-sm font-bold ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>{product.stock} units</span></div>)}</div>
              </div>
            </div>
          )}

          {/* CMS */}
          {activeTab === "cms" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">CMS Screens</h3>
                  <p className="mt-1 text-sm text-[#4a3d38]">Edit website content page by page without touching code.</p>
                </div>
                <p className="flex items-center gap-2 text-xs text-emerald-400"><Save size={13} /> Auto-saved in browser</p>
              </div>

              {/* Page tabs */}
              <div className="flex flex-wrap gap-2">
                {(["home", "about", "contact", "wholesale", "export"] as const).map((page) => (
                  <button key={page} onClick={() => setCmsPage(page)}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
                      cmsPage === page ? "bg-[#c94708] text-white shadow-[0_4px_15px_rgba(201,71,8,0.35)]" : "border border-[#1e1410] text-[#6b5e58] hover:border-[#c94708]/50 hover:text-white"
                    }`}>
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                ))}
              </div>

              {/* ── HOME ── */}
              {cmsPage === "home" && (
                <div className="space-y-4">

                  {/* Navbar */}
                  {([
                    ["navbar", "Navbar", [
                      { key: "navLinks", label: "Nav Links (comma-separated)", isArray: true },
                      { key: "navCta", label: "CTA Button Text" },
                    ]],
                    ["hero", "Hero Section", [
                      { key: "heroTitle", label: "Main Title" },
                      { key: "heroSubtitle", label: "Subtitle", long: true },
                      { key: "heroBtn1", label: "Button 1 Text" },
                      { key: "heroBtn2", label: "Button 2 Text" },
                      { key: "heroStat1Val", label: "Stat 1 Value" }, { key: "heroStat1Label", label: "Stat 1 Label" },
                      { key: "heroStat2Val", label: "Stat 2 Value" }, { key: "heroStat2Label", label: "Stat 2 Label" },
                      { key: "heroStat3Val", label: "Stat 3 Value" }, { key: "heroStat3Label", label: "Stat 3 Label" },
                      { key: "heroStat4Val", label: "Stat 4 Value" }, { key: "heroStat4Label", label: "Stat 4 Label" },
                    ]],
                    ["announcement", "Announcement Bar", [
                      { key: "announcementText", label: "Announcement Text" },
                      { key: "announcementLink", label: "Link Text" },
                    ]],
                    ["categories", "Categories Section", [
                      { key: "categoriesSubheading", label: "Subheading" },
                      { key: "categoriesHeading", label: "Heading" },
                    ]],
                    ["features", "Features Strip", [
                      { key: "feature1Title", label: "Feature 1 Title" }, { key: "feature1Desc", label: "Feature 1 Description", long: true },
                      { key: "feature2Title", label: "Feature 2 Title" }, { key: "feature2Desc", label: "Feature 2 Description", long: true },
                      { key: "feature3Title", label: "Feature 3 Title" }, { key: "feature3Desc", label: "Feature 3 Description", long: true },
                      { key: "feature4Title", label: "Feature 4 Title" }, { key: "feature4Desc", label: "Feature 4 Description", long: true },
                    ]],
                    ["products", "Featured Products Section", [
                      { key: "productsSubheading", label: "Subheading" },
                      { key: "productsHeading", label: "Heading" },
                    ]],
                    ["wholesaleBanner", "Wholesale Banner", [
                      { key: "wholesaleBannerTag", label: "Tag Line" },
                      { key: "wholesaleBannerTitle", label: "Title" },
                      { key: "wholesaleBannerDesc", label: "Description", long: true },
                      { key: "wholesaleBannerBtn1", label: "Button 1 Text" },
                      { key: "wholesaleBannerBtn2", label: "Button 2 Text" },
                    ]],
                    ["testimonials", "Testimonials", [
                      { key: "testimonialsSubheading", label: "Subheading" },
                      { key: "testimonialsHeading", label: "Heading" },
                      { key: "testimonial1Name", label: "Testimonial 1 Name" }, { key: "testimonial1Role", label: "Testimonial 1 Role" }, { key: "testimonial1Text", label: "Testimonial 1 Text", long: true },
                      { key: "testimonial2Name", label: "Testimonial 2 Name" }, { key: "testimonial2Role", label: "Testimonial 2 Role" }, { key: "testimonial2Text", label: "Testimonial 2 Text", long: true },
                      { key: "testimonial3Name", label: "Testimonial 3 Name" }, { key: "testimonial3Role", label: "Testimonial 3 Role" }, { key: "testimonial3Text", label: "Testimonial 3 Text", long: true },
                    ]],
                    ["cta", "Call-to-Action Section", [
                      { key: "ctaTitle", label: "Title" },
                      { key: "ctaDescription", label: "Description", long: true },
                      { key: "ctaBtn1", label: "Button 1 Text" },
                      { key: "ctaBtn2", label: "Button 2 Text" },
                    ]],
                  ] as [string, string, { key: string; label: string; long?: boolean; isArray?: boolean }[]][]).map(([sectionId, sectionTitle, fields]) => (
                    <div key={sectionId} className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
                      <button
                        type="button"
                        onClick={() => toggleCmsSection(sectionId)}
                        className="flex w-full items-center justify-between px-6 py-4 text-left"
                      >
                        <span className="text-sm font-bold text-white">{sectionTitle}</span>
                        <ChevronRight size={16} className={`text-[#6b5e58] transition-transform ${cmsOpenSections[sectionId] ? "rotate-90" : ""}`} />
                      </button>
                      {cmsOpenSections[sectionId] && (
                        <div className="grid gap-4 border-t border-[#1e1410] px-6 pb-6 pt-5 sm:grid-cols-2">
                          {fields.map(({ key, label, long, isArray }) => (
                            <label key={key} className={`text-xs font-semibold text-[#6b5e58] ${long ? "sm:col-span-2" : ""}`}>
                              {label}
                              {long ? (
                                <textarea rows={3} value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
                              ) : (
                                <input type="text" value={isArray ? (cmsContent[key] as string[])?.join(", ") ?? "" : cmsContent[key] ?? ""}
                                  onChange={(e) => setCmsContent({ ...cmsContent, [key]: isArray ? e.target.value.split(",").map((s: string) => s.trim()) : e.target.value })}
                                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── ABOUT ── */}
              {cmsPage === "about" && (
                <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
                  <div className="border-b border-[#1e1410] px-6 py-4"><p className="text-sm font-bold text-white">About Page</p></div>
                  <div className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
                    {[
                      { key: "aboutIntro", label: "Introduction", long: true },
                      { key: "aboutMission", label: "Mission Statement", long: true },
                    ].map(({ key, label, long }) => (
                      <label key={key} className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">
                        {label}
                        {long ? <textarea rows={3} value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" /> : <input type="text" value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CONTACT ── */}
              {cmsPage === "contact" && (
                <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
                  <div className="border-b border-[#1e1410] px-6 py-4"><p className="text-sm font-bold text-white">Contact Page</p></div>
                  <div className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
                    {[
                      { key: "contactSubheading", label: "Subheading" },
                      { key: "contactHeading", label: "Heading" },
                      { key: "contactIntro", label: "Intro Text", long: true },
                    ].map(({ key, label, long }) => (
                      <label key={key} className={`text-xs font-semibold text-[#6b5e58] ${long ? "sm:col-span-2" : ""}`}>
                        {label}
                        {long ? <textarea rows={3} value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" /> : <input type="text" value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── WHOLESALE ── */}
              {cmsPage === "wholesale" && (
                <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
                  <div className="border-b border-[#1e1410] px-6 py-4"><p className="text-sm font-bold text-white">Wholesale Page</p></div>
                  <div className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
                    {[
                      { key: "wholesaleHeading", label: "Heading" },
                      { key: "wholesaleIntro", label: "Intro Text", long: true },
                    ].map(({ key, label, long }) => (
                      <label key={key} className={`text-xs font-semibold text-[#6b5e58] ${long ? "sm:col-span-2" : ""}`}>
                        {label}
                        {long ? <textarea rows={3} value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" /> : <input type="text" value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── EXPORT ── */}
              {cmsPage === "export" && (
                <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
                  <div className="border-b border-[#1e1410] px-6 py-4"><p className="text-sm font-bold text-white">Export Page</p></div>
                  <div className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
                    {[
                      { key: "exportHeading", label: "Heading" },
                      { key: "exportIntro", label: "Intro Text", long: true },
                    ].map(({ key, label, long }) => (
                      <label key={key} className={`text-xs font-semibold text-[#6b5e58] ${long ? "sm:col-span-2" : ""}`}>
                        {label}
                        {long ? <textarea rows={3} value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" /> : <input type="text" value={cmsContent[key] ?? ""} onChange={(e) => setCmsContent({ ...cmsContent, [key]: e.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Media Library</h3>
                <p className="mt-1 text-sm text-[#4a3d38]">Upload images or add images from an online URL.</p>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-5 sm:flex-row">
                <input value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708]" />
                <button type="button" onClick={() => addMediaAsset(mediaUrl, "Online image")} className="rounded-xl bg-[#c94708] px-5 py-3 text-sm font-bold text-white hover:bg-[#a83906]"><Image size={16} className="mr-2 inline" />Add URL</button>
                <label className="cursor-pointer rounded-xl border border-[#1e1410] px-5 py-3 text-center text-sm font-bold text-[#6b5e58] hover:border-[#c94708] hover:text-white"><Upload size={16} className="mr-2 inline" />Browse<input type="file" accept="image/*" onChange={handleMediaUpload} className="sr-only" /></label>
              </div>
              {mediaAssets.length === 0 ? <div className="rounded-2xl border border-dashed border-[#2a1f1a] p-12 text-center text-sm text-[#6b5e58]">No media assets yet.</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{mediaAssets.map((asset) => <div key={asset.id} className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]"><img src={asset.url} alt={asset.name} className="h-36 w-full object-cover" /><div className="flex items-center justify-between gap-2 p-3"><p className="truncate text-xs text-white">{asset.name}</p><button type="button" onClick={() => setMediaAssets((current) => current.filter((item) => item.id !== asset.id))} aria-label={`Delete ${asset.name}`} className="text-[#6b5e58] hover:text-red-400"><Trash size={14} /></button></div></div>)}</div>}
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
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Store Settings</h3>
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-[#6b5e58]">Company name
                    <input value={adminSettings.companyName} onChange={(event) => setAdminSettings({ ...adminSettings, companyName: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-[#6b5e58]">Currency
                      <select value={adminSettings.currency} onChange={(event) => setAdminSettings({ ...adminSettings, currency: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"><option>RWF</option><option>USD</option><option>EUR</option></select>
                    </label>
                    <label className="block text-xs font-semibold text-[#6b5e58]">Opening hours
                      <input value={adminSettings.hours} onChange={(event) => setAdminSettings({ ...adminSettings, hours: event.target.value })} className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]" />
                    </label>
                  </div>
                  <label className="flex items-center gap-3 text-sm text-[#6b5e58]"><input type="checkbox" checked={adminSettings.emailNotifications} onChange={(event) => setAdminSettings({ ...adminSettings, emailNotifications: event.target.checked })} className="h-4 w-4 accent-[#c94708]" /> Email notifications enabled</label>
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
