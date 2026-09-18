import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Menu, X, BarChart3, ShoppingBag, Users,
  Bell, ChevronRight, Edit2, Sun, Moon, FileText, Search,
  TrendingUp, DollarSign, Package, UserCheck, Clock,
  Download, Receipt, CreditCard, CheckCircle2, FileSpreadsheet,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import {
  fetchSalesProducts,
  updateSalesProduct,
  fetchSalesPayments,
  confirmSalesPayment,
  fetchSalesCustomers,
  updateSalesOrderStatus,
  fetchSalesQuotations,
  updateSalesQuotationStatus,
  generateSalesInvoice,
  exportCsv,
  urlToImageFile,
  type AdminPayment,
  type AdminCustomer,
  type AdminQuotation,
} from "../api/salesManager";
import type { Product } from "../data/product";

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: BarChart3,       label: "Overview",   id: "overview"   },
  { icon: ShoppingBag,     label: "Orders",     id: "orders"     },
  { icon: Package,         label: "Products",   id: "products"   },
  { icon: FileText,        label: "Quotations", id: "quotations" },
  { icon: Users,           label: "Customers",  id: "customers"  },
  { icon: CreditCard,      label: "Payments",   id: "payments"   },
  { icon: Receipt,         label: "Invoices",   id: "invoices"   },
  { icon: FileSpreadsheet, label: "Reports",    id: "reports"    },
] as const;

type Tab = (typeof NAV_ITEMS)[number]["id"];

type OrderStatus = "Pending Payment" | "Processing" | "Completed" | "Cancelled";
const ORDER_STATUSES: OrderStatus[] = ["Pending Payment", "Processing", "Completed", "Cancelled"];

const orderStatusToApi: Record<OrderStatus, string> = {
  "Pending Payment": "pending",
  Processing: "processing",
  Completed: "completed",
  Cancelled: "cancelled",
};
const apiStatusToOrder: Record<string, OrderStatus> = {
  pending: "Pending Payment",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ─────────────────────────────────────────────────────────────────────────────
// View models
// ─────────────────────────────────────────────────────────────────────────────
interface SalesOrder {
  id: number;
  customer: string;
  email: string;
  items: string;
  total: number;
  paymentStatus: "Pending" | "Paid";
  status: OrderStatus;
  date: string;
}
interface SalesCustomer {
  id: string; name: string; email: string; phone: string;
  orders: number; spending: number; status: "Active" | "Pending";
}
interface SalesPayment {
  id: number; orderId: number | null; customer: string; email: string;
  amount: number; method: string;
  status: "Pending" | "Paid" | "Failed"; date: string;
}
interface SalesQuotation {
  id: string; company: string; country: string; products: string;
  quantity: string; schedule: string;
  status: "New" | "Reviewing" | "Quoted" | "Accepted" | "Declined"; date: string;
}
interface SalesInvoice {
  id: string; orderId: number | null; customer: string; email: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue"; issued: string; due: string;
}

// Full inventory form (matches ProductController's UpdateProduct validator)
interface InventoryForm {
  name: string;
  price: string;
  stock: string;
  description: string;
  packaging: string;
  origin: string;
  unit: string;
  quality: string;
  imageUrl: string;
}

const emptyInventoryForm: InventoryForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  packaging: "",
  origin: "Rwanda",
  unit: "",
  quality: "Grade A",
  imageUrl: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Adapters (payments → view models)
// ─────────────────────────────────────────────────────────────────────────────
function paymentsToOrders(payments: AdminPayment[]): SalesOrder[] {
  const orders = new Map<number, SalesOrder>();
  payments.forEach((payment) => {
    if (!payment.order || orders.has(payment.order.id)) return;
    orders.set(payment.order.id, {
      id: payment.order.id,
      customer: payment.user?.full_name ?? "Guest customer",
      email: payment.user?.email ?? "",
      items:
        payment.order.order_items
          ?.map((item) => `${item.product?.name ?? "Product"} x ${item.quantity}`)
          .join(", ") || "Order items unavailable",
      total: Number(payment.order.total ?? payment.order.total_amount ?? payment.amount),
      paymentStatus: payment.status === "completed" ? "Paid" : "Pending",
      status: apiStatusToOrder[payment.order.status] ?? "Pending Payment",
      date: new Date(payment.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    });
  });
  return [...orders.values()];
}

function paymentsToPayments(payments: AdminPayment[]): SalesPayment[] {
  return payments.map((payment) => ({
    id: payment.id,
    orderId: payment.order?.id ?? null,
    customer: payment.user?.full_name ?? "Guest customer",
    email: payment.user?.email ?? "",
    amount: Number(payment.amount),
    method: payment.method ?? "Unknown",
    status:
      payment.status === "completed" ? "Paid"
      : payment.status === "failed" ? "Failed"
      : "Pending",
    date: new Date(payment.created_at).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
  }));
}

function quotationsToQuotations(rows: AdminQuotation[]): SalesQuotation[] {
  return rows.map((q) => ({
    id: q.reference ?? `QUO-${q.id}`,
    company: q.company_name,
    country: q.country,
    products: q.products_summary ?? "",
    quantity: q.quantity ?? "",
    schedule: q.schedule ?? "",
    status: (q.status as SalesQuotation["status"]) ?? "New",
    date: new Date(q.created_at).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
  }));
}

function mergeCustomers(
  customersData: AdminCustomer[],
  payments: AdminPayment[],
): SalesCustomer[] {
  const customers = new Map<number, SalesCustomer>();
  customersData.forEach((customer) => {
    customers.set(customer.id, {
      id: String(customer.id),
      name: customer.full_name,
      email: customer.email,
      phone: customer.phone_number,
      orders: 0, spending: 0, status: "Active",
    });
  });
  payments.forEach((payment) => {
    if (!payment.user) return;
    const customer =
      customers.get(payment.user.id) ?? {
        id: String(payment.user.id),
        name: payment.user.full_name,
        email: payment.user.email,
        phone: payment.user.phone_number,
        orders: 0, spending: 0, status: "Active",
      };
    customer.orders += payment.order ? 1 : 0;
    customer.spending += Number(payment.amount);
    customers.set(payment.user.id, customer);
  });
  return [...customers.values()];
}

function ordersToInvoices(orders: SalesOrder[]): SalesInvoice[] {
  return orders
    .filter((o) => o.paymentStatus === "Paid")
    .map((o) => ({
      id: `INV-${new Date().getFullYear()}-${String(o.id).padStart(4, "0")}`,
      orderId: o.id,
      customer: o.customer,
      email: o.email,
      amount: o.total,
      status: o.status === "Completed" ? "Paid" : "Sent",
      issued: o.date,
      due: new Date(Date.now() + 14 * 864e5).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SalesManagerDashboard() {
  const { user, token, logout: logoutAdmin } = useUser();
  const isSalesManager = !!user && user.role === "sales_manager";
  const managerEmail = user?.email ?? null;
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lightMode, setLightMode] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [payments, setPayments] = useState<SalesPayment[]>([]);
  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [quotations, setQuotations] = useState<SalesQuotation[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [quotationSearch, setQuotationSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  // Product inventory modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | undefined>();
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState<InventoryForm>(emptyInventoryForm);

  // Auto-dismiss success banner
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // ── Data load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !isSalesManager) return;
    setLoading(true);
    setApiError("");
    Promise.all([
      fetchSalesProducts(token),
      fetchSalesPayments(token),
      fetchSalesCustomers(token),
      fetchSalesQuotations(token).catch(() => [] as AdminQuotation[]),
    ])
      .then(([productData, paymentData, customerData, quotationData]) => {
        setProducts(productData);
        const mappedOrders = paymentsToOrders(paymentData);
        setOrders(mappedOrders);
        setPayments(paymentsToPayments(paymentData));
        setCustomers(mergeCustomers(customerData, paymentData));
        setQuotations(quotationsToQuotations(quotationData));
        setInvoices(ordersToInvoices(mappedOrders));
      })
      .catch(() => setApiError("Could not load dashboard data from the backend."))
      .finally(() => setLoading(false));
  }, [isSalesManager, token]);

  if (!isSalesManager) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => { logoutAdmin(); navigate("/"); };

  // ── PRODUCT INVENTORY: open the edit modal ────────────────────────────────
  const openProductForm = (product: Product) => {
    setEditingProduct(product);
    setProductImageFile(undefined);
    setProductForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      packaging: product.packaging,
      origin: product.origin,
      unit: product.unit,
      quality: product.grade,
      imageUrl: product.image,
    });
    setApiError("");
    setProductModalOpen(true);
  };

  // ── PRODUCT INVENTORY: save (UPDATE only) ─────────────────────────────────
  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !editingProduct) return;

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (
      !productForm.name.trim() ||
      !price || price <= 0 ||
      Number.isNaN(stock) || stock < 0 ||
      !productForm.packaging.trim() ||
      !productForm.origin.trim() ||
      !productForm.unit.trim() ||
      !productForm.quality.trim()
    ) {
      setApiError("Complete all product fields with valid values.");
      return;
    }

    setSavingProduct(true);
    setApiError("");
    try {
      // Resolve image: file wins, else download from URL if changed
      let image: File | undefined = productImageFile;
      const urlChanged =
        productForm.imageUrl.trim() &&
        productForm.imageUrl.trim() !== editingProduct.image;
      if (!image && urlChanged) {
        try {
          image = await urlToImageFile(productForm.imageUrl.trim());
        } catch (err: any) {
          setApiError(err.message || "The image URL could not be used.");
          setSavingProduct(false);
          return;
        }
      }

      const saved = await updateSalesProduct(token, editingProduct.id, {
        name: productForm.name.trim(),
        price,
        description: productForm.description,
        stock_quantity: stock,
        packaging_type: productForm.packaging.trim(),
        country_of_origin: productForm.origin.trim(),
        unit: productForm.unit.trim(),
        quality_type: productForm.quality.trim(),
        image,
      });

      setProducts((current) => current.map((p) => (p.id === saved.id ? saved : p)));
      setProductModalOpen(false);
      setSuccessMessage(`"${saved.name}" updated successfully.`);
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : "";
      setApiError(
        validationMessage ||
          error?.message ||
          error?.response?.data?.message ||
          "Could not update the product.",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  // ── Order status ──────────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    if (!token) return;
    const previous = orders.find((o) => o.id === orderId)?.status;
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
    try {
      await updateSalesOrderStatus(token, orderId, orderStatusToApi[status]);
    } catch {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId && previous ? { ...order, status: previous } : order,
        ),
      );
      setApiError("Could not update the order status.");
    }
  };

  // ── Payment confirmation ──────────────────────────────────────────────────
  const confirmPayment = async (paymentId: number) => {
    if (!token) return;
    try {
      await confirmSalesPayment(token, paymentId);
      setPayments((current) =>
        current.map((p) => (p.id === paymentId ? { ...p, status: "Paid" } : p)),
      );
      const payment = payments.find((p) => p.id === paymentId);
      if (payment?.orderId != null) {
        setOrders((current) =>
          current.map((o) =>
            o.id === payment.orderId ? { ...o, paymentStatus: "Paid" } : o,
          ),
        );
      }
      setSuccessMessage("Payment confirmed.");
    } catch {
      setApiError("Could not confirm the payment.");
    }
  };

  // ── Invoice generation ────────────────────────────────────────────────────
  const generateInvoice = async (orderId: number) => {
    if (!token) return;
    try {
      await generateSalesInvoice(token, orderId);
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      const newInvoice: SalesInvoice = {
        id: `INV-${new Date().getFullYear()}-${String(orderId).padStart(4, "0")}`,
        orderId,
        customer: order.customer,
        email: order.email,
        amount: order.total,
        status: "Sent",
        issued: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        due: new Date(Date.now() + 14 * 864e5).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
      };
      setInvoices((current) => [newInvoice, ...current]);
      setSuccessMessage(`Invoice ${newInvoice.id} generated.`);
    } catch {
      setApiError("Could not generate the invoice.");
    }
  };

  // ── Quotation status ──────────────────────────────────────────────────────
  const updateQuotationStatus = async (
    quotationId: string,
    status: SalesQuotation["status"],
  ) => {
    if (!token) return;
    const previous = quotations.find((q) => q.id === quotationId)?.status;
    setQuotations((current) =>
      current.map((q) => (q.id === quotationId ? { ...q, status } : q)),
    );
    try {
      await updateSalesQuotationStatus(token, quotationId, status);
    } catch {
      setQuotations((current) =>
        current.map((q) =>
          q.id === quotationId && previous ? { ...q, status: previous } : q,
        ),
      );
      setApiError("Could not update the quotation status.");
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const paidOrders = useMemo(() => orders.filter((o) => o.paymentStatus === "Paid"), [orders]);
  const revenue = useMemo(() => paidOrders.reduce((t, o) => t + o.total, 0), [paidOrders]);
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const pendingOrders = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const avgOrderValue = orders.length ? revenue / orders.length : 0;

  const stats = [
    { label: "Total Revenue", value: `Fr ${revenue.toLocaleString()}`, change: "Live", icon: DollarSign,   color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Orders",  value: String(orders.length),            change: "Live", icon: ShoppingBag,  color: "text-blue-400",    bg: "bg-blue-400/10"    },
    { label: "Customers",     value: String(customers.length),         change: "Live", icon: Users,        color: "text-purple-400",  bg: "bg-purple-400/10"  },
    { label: "Avg Order Value", value: `Fr ${Math.round(avgOrderValue).toLocaleString()}`, change: "Live", icon: TrendingUp, color: "text-[#c94708]", bg: "bg-[#c94708]/10" },
  ];

  const visibleProducts   = products.filter((p) => `${p.name} ${p.category} ${p.code}`.toLowerCase().includes(productSearch.toLowerCase()));
  const visibleOrders     = orders.filter((o) => `${o.id} ${o.customer} ${o.email} ${o.items} ${o.status}`.toLowerCase().includes(orderSearch.toLowerCase()));
  const visibleCustomers  = customers.filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(customerSearch.toLowerCase()));
  const visibleQuotations = quotations.filter((q) => `${q.id} ${q.company} ${q.country} ${q.products} ${q.status}`.toLowerCase().includes(quotationSearch.toLowerCase()));
  const visiblePayments   = payments.filter((p) => `${p.id} ${p.customer} ${p.email} ${p.method} ${p.status}`.toLowerCase().includes(paymentSearch.toLowerCase()));
  const visibleInvoices   = invoices.filter((i) => `${i.id} ${i.customer} ${i.email} ${i.status}`.toLowerCase().includes(invoiceSearch.toLowerCase()));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`admin-dashboard flex min-h-screen bg-[#0d0906] text-white ${lightMode ? "admin-light" : ""}`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-[72px]"} fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#1e1410] bg-[#0f0a08] transition-all duration-300`}>
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
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

        <div className="border-t border-[#1e1410] px-3 py-4 space-y-1">
          {sidebarOpen && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#1a1008] px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c94708]/20 text-[#c94708] text-xs font-bold">
                {managerEmail?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{managerEmail}</p>
                <p className="text-[10px] text-[#4a3d38]">Sales Manager</p>
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] hover:text-white transition"
            >
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] hover:text-white transition">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c94708]" />
            </button>
            <a href="/" className="flex items-center gap-2 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2 text-xs font-medium text-[#6b5e58] hover:text-white transition">
              View Store <ChevronRight size={14} />
            </a>
          </div>
        </header>

        <div className="p-8">
          {apiError && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              <span>{apiError}</span>
              <button onClick={() => setApiError("")} className="text-red-400 hover:text-red-300">
                <X size={14} />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-emerald-300">
                <X size={14} />
              </button>
            </div>
          )}
          {loading && (
            <div className="mb-6 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-[#6b5e58]">
              Loading dashboard data...
            </div>
          )}

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
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

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Sales Snapshot</h3>
                  <div className="space-y-4">
                    <Row icon={<UserCheck size={15} className="text-emerald-400" />} label="Paid Orders" value={paidOrders.length} />
                    <Row icon={<Clock size={15} className="text-amber-400" />}     label="Pending Orders" value={pendingOrders} />
                    <Row icon={<Package size={15} className="text-[#c94708]" />}   label="Completed Orders" value={completedOrders} />
                    <Row icon={<FileText size={15} className="text-blue-400" />}   label="Open Quotations" value={quotations.filter((q) => q.status === "New" || q.status === "Reviewing").length} />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">Top Products</h3>
                  {products.slice(0, 3).map((p) => (
                    <div key={p.id} className="mb-3 flex items-center gap-4 rounded-xl border border-[#1e1410] bg-[#1a1008] p-3">
                      <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-[#4a3d38]">{p.category}</p>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-sm text-[#6b5e58]">No products yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ ORDERS ═══════════════ */}
          {activeTab === "orders" && (
            <Panel
              title="Order Management"
              subtitle={`${orders.length} customer orders`}
              search={{ value: orderSearch, onChange: setOrderSearch, placeholder: "Search orders..." }}
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Order", "Customer", "Total", "Payment", "Delivery Status", "Invoice", "Date"].map((h) => (
                      <Th key={h}>{h}</Th>
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
                        <Pill ok={order.paymentStatus === "Paid"}>{order.paymentStatus}</Pill>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="rounded-lg border border-[#1e1410] bg-[#1a1008] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[#c94708]"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => generateInvoice(order.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-[#1e1410] px-3 py-1.5 text-xs font-semibold text-[#6b5e58] hover:border-[#c94708] hover:text-[#c94708] transition"
                        >
                          <Receipt size={12} /> Generate
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6b5e58]">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleOrders.length === 0 && <Empty>No orders match your search.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ PRODUCTS — INVENTORY MANAGEMENT ═══════════════ */}
          {activeTab === "products" && (
            <Panel
              title="Products — Inventory Management"
              subtitle="Update stock, prices, packaging and images. Creation and deletion are admin-only."
              search={{ value: productSearch, onChange: setProductSearch, placeholder: "Search products..." }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Product", "Category", "Price", "Stock", "Packaging", "Actions"].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((p) => (
                    <tr key={p.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                            <p className="mt-0.5 text-[10px] text-[#4a3d38]">{p.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-[#2a1f1a] bg-[#1a1008] px-3 py-1 text-xs font-medium text-[#6b5e58]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#c94708]">
                        Fr {p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${p.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${p.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6b5e58]">
                        {p.packaging || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openProductForm(p)}
                          aria-label={`Edit ${p.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e1410] text-[#6b5e58] hover:border-[#c94708] hover:text-[#c94708] transition"
                        >
                          <Edit2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleProducts.length === 0 && <Empty>No products match your search.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ QUOTATIONS ═══════════════ */}
          {activeTab === "quotations" && (
            <Panel
              title="Export Quotations"
              subtitle="Process incoming international business requests."
              search={{ value: quotationSearch, onChange: setQuotationSearch, placeholder: "Search quotations..." }}
            >
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Quotation", "Company", "Destination", "Products", "Quantity", "Status", "Date"].map((h) => <Th key={h}>{h}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {visibleQuotations.map((q) => (
                    <tr key={q.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">{q.id}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{q.schedule}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">{q.company}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm text-[#6b5e58]">
                          <span className="text-[#c94708]">●</span> {q.country}
                        </span>
                      </td>
                      <td className="max-w-xs px-6 py-4 text-xs text-[#6b5e58]">{q.products}</td>
                      <td className="px-6 py-4 text-sm text-white">{q.quantity}</td>
                      <td className="px-6 py-4">
                        <select
                          value={q.status}
                          onChange={(e) => updateQuotationStatus(q.id, e.target.value as SalesQuotation["status"])}
                          className="rounded-lg border border-[#1e1410] bg-[#1a1008] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-[#c94708]"
                        >
                          {["New", "Reviewing", "Quoted", "Accepted", "Declined"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6b5e58]">{q.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleQuotations.length === 0 && <Empty>No quotations match your search.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ CUSTOMERS ═══════════════ */}
          {activeTab === "customers" && (
            <Panel
              title="Customer Information"
              subtitle={`${customers.length} registered clients — view only`}
              search={{ value: customerSearch, onChange: setCustomerSearch, placeholder: "Search customers..." }}
            >
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Customer", "Contact", "Orders", "Total Spending", "Status"].map((h) => <Th key={h}>{h}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {visibleCustomers.map((c) => (
                    <tr key={c.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{c.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-white">{c.email}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{c.orders}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {c.spending.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Pill ok={c.status === "Active"}>{c.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleCustomers.length === 0 && <Empty>No customers match your search.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ PAYMENTS ═══════════════ */}
          {activeTab === "payments" && (
            <Panel
              title="Payment Confirmation"
              subtitle="Confirm pending payments so orders can be fulfilled."
              search={{ value: paymentSearch, onChange: setPaymentSearch, placeholder: "Search payments..." }}
            >
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Payment", "Order", "Customer", "Amount", "Method", "Status", "Actions"].map((h) => <Th key={h}>{h}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.map((p) => (
                    <tr key={p.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">#{p.id}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{p.date}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b5e58]">{p.orderId ?? "—"}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{p.customer}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{p.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-white capitalize">{p.method}</td>
                      <td className="px-6 py-4">
                        <Pill ok={p.status === "Paid"}>{p.status}</Pill>
                      </td>
                      <td className="px-6 py-4">
                        {p.status === "Pending" ? (
                          <button
                            onClick={() => confirmPayment(p.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition"
                          >
                            <CheckCircle2 size={12} /> Confirm
                          </button>
                        ) : (
                          <span className="text-xs text-[#4a3d38]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visiblePayments.length === 0 && <Empty>No payments match your search.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ INVOICES ═══════════════ */}
          {activeTab === "invoices" && (
            <Panel
              title="Invoices"
              subtitle={`${invoices.length} invoices issued`}
              search={{ value: invoiceSearch, onChange: setInvoiceSearch, placeholder: "Search invoices..." }}
              action={
                <button
                  onClick={() =>
                    exportCsv(
                      `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["Invoice", "Order", "Customer", "Email", "Amount", "Status", "Issued", "Due"],
                      invoices.map((i) => [i.id, i.orderId ?? "", i.customer, i.email, i.amount, i.status, i.issued, i.due]),
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2 text-xs font-semibold text-[#6b5e58] hover:text-white transition"
                >
                  <Download size={13} /> Export CSV
                </button>
              }
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#1e1410]">
                    {["Invoice", "Order", "Customer", "Amount", "Status", "Issued", "Due"].map((h) => <Th key={h}>{h}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {visibleInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
                      <td className="px-6 py-4 text-sm font-bold text-white">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-[#6b5e58]">{inv.orderId ?? "—"}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{inv.customer}</p>
                        <p className="mt-1 text-xs text-[#4a3d38]">{inv.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#c94708]">Fr {inv.amount.toLocaleString()}</td>
                      <td className="px-6 py-4"><Pill ok={inv.status === "Paid"}>{inv.status}</Pill></td>
                      <td className="px-6 py-4 text-xs text-[#6b5e58]">{inv.issued}</td>
                      <td className="px-6 py-4 text-xs text-[#6b5e58]">{inv.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleInvoices.length === 0 && <Empty>No invoices yet. Generate one from an order.</Empty>}
            </Panel>
          )}

          {/* ═══════════════ REPORTS ═══════════════ */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Sales Reports</h3>
                <p className="mt-1 text-sm text-[#4a3d38]">Export raw CSV data for analysis in a spreadsheet tool.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Paid Revenue", `Fr ${revenue.toLocaleString()}`, "text-emerald-400"],
                  ["Total Orders", String(orders.length), "text-blue-400"],
                  ["Pending Orders", String(pendingOrders), "text-amber-400"],
                  ["Completed Orders", String(completedOrders), "text-[#c94708]"],
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#4a3d38]">{label}</p>
                    <p className={`mt-3 text-3xl font-black ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <ReportCard
                  icon={<ShoppingBag size={18} />}
                  title="Orders Report"
                  description="All orders with customer, status and totals."
                  onExport={() =>
                    exportCsv(
                      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["Order", "Customer", "Email", "Items", "Total", "Payment", "Status", "Date"],
                      orders.map((o) => [o.id, o.customer, o.email, o.items, o.total, o.paymentStatus, o.status, o.date]),
                    )
                  }
                />
                <ReportCard
                  icon={<CreditCard size={18} />}
                  title="Payments Report"
                  description="Confirmed and pending payments."
                  onExport={() =>
                    exportCsv(
                      `payments-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["Payment", "Order", "Customer", "Email", "Amount", "Method", "Status", "Date"],
                      payments.map((p) => [p.id, p.orderId ?? "", p.customer, p.email, p.amount, p.method, p.status, p.date]),
                    )
                  }
                />
                <ReportCard
                  icon={<Users size={18} />}
                  title="Customers Report"
                  description="Customer spend and order counts."
                  onExport={() =>
                    exportCsv(
                      `customers-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["ID", "Name", "Email", "Phone", "Orders", "Spending", "Status"],
                      customers.map((c) => [c.id, c.name, c.email, c.phone, c.orders, c.spending, c.status]),
                    )
                  }
                />
                <ReportCard
                  icon={<Package size={18} />}
                  title="Inventory Report"
                  description="Current stock and prices for every product."
                  onExport={() =>
                    exportCsv(
                      `inventory-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["ID", "Name", "Category", "Price", "Stock", "Code"],
                      products.map((p) => [p.id, p.name, p.category, p.price, p.stock, p.code]),
                    )
                  }
                />
                <ReportCard
                  icon={<FileText size={18} />}
                  title="Quotations Report"
                  description="Export pipeline and quotation statuses."
                  onExport={() =>
                    exportCsv(
                      `quotations-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["Quotation", "Company", "Country", "Products", "Quantity", "Status", "Date"],
                      quotations.map((q) => [q.id, q.company, q.country, q.products, q.quantity, q.status, q.date]),
                    )
                  }
                />
                <ReportCard
                  icon={<Receipt size={18} />}
                  title="Invoices Report"
                  description="Issued invoices with payment status."
                  onExport={() =>
                    exportCsv(
                      `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
                      ["Invoice", "Order", "Customer", "Email", "Amount", "Status", "Issued", "Due"],
                      invoices.map((i) => [i.id, i.orderId ?? "", i.customer, i.email, i.amount, i.status, i.issued, i.due]),
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════ PRODUCT EDIT MODAL ═══════════════ */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 py-8">
          <form
            onSubmit={saveProduct}
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Product</h2>
                <p className="mt-1 text-xs text-[#4a3d38]">
                  Update inventory, pricing and packaging details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                aria-label="Close product form"
                className="text-[#6b5e58] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">
                Product name
                <input
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Price (RWF)
                <input
                  required
                  min="1"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Stock quantity
                <input
                  required
                  min="0"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Packaging type
                <input
                  required
                  value={productForm.packaging}
                  onChange={(e) => setProductForm({ ...productForm, packaging: e.target.value })}
                  placeholder="e.g. 12 bottles per carton"
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Unit
                <input
                  required
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  placeholder="e.g. 500ml bottle"
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Country of origin
                <input
                  required
                  value={productForm.origin}
                  onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58]">
                Quality type
                <input
                  required
                  value={productForm.quality}
                  onChange={(e) => setProductForm({ ...productForm, quality: e.target.value })}
                  placeholder="e.g. Grade A"
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">
                Replace image (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={(e) => setProductImageFile(e.target.files?.[0])}
                  className="mt-2 block w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-[#c94708] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                />
                <span className="mt-1 block text-[11px] font-normal text-[#4a3d38]">
                  Leave blank to keep the current image. You can also paste a new URL below.
                </span>
              </label>

              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">
                Image URL
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>

              <label className="text-xs font-semibold text-[#6b5e58] sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="mt-2 w-full resize-y rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-xl border border-[#1e1410] px-5 py-3 text-sm font-semibold text-[#6b5e58] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="rounded-xl bg-[#c94708] px-5 py-3 text-sm font-bold text-white hover:bg-[#a83906] disabled:opacity-60"
              >
                {savingProduct ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Presentational helpers                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4a3d38]">
      {children}
    </th>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-6 py-10 text-center text-sm text-[#6b5e58]">{children}</p>;
}

function Pill({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        ok ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
      }`}
    >
      {children}
    </span>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-[#6b5e58]">{icon}{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  search,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  search?: { value: string; onChange: (v: string) => void; placeholder: string };
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e1410] px-6 py-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-[#4a3d38]">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {search && (
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3d38]" />
              <input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder}
                className="w-full rounded-xl border border-[#1e1410] bg-[#1a1008] py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#4a3d38] outline-none focus:border-[#c94708]"
              />
            </div>
          )}
          {action}
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function ReportCard({
  icon,
  title,
  description,
  onExport,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#c94708]/10 text-[#c94708]">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="mt-1 flex-1 text-xs text-[#6b5e58]">{description}</p>
      <button
        onClick={onExport}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#c94708] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#a83906] transition shadow-[0_4px_15px_rgba(201,71,8,0.3)]"
      >
        <Download size={13} /> Export CSV
      </button>
    </div>
  );
}