import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo-image.png";
import {
  LogOut,
  Menu,
  X,
  BarChart3,
  ShoppingBag,
  Users,
  ChevronRight,
  Edit2,
  Sun,
  Moon,
  Search,
  TrendingUp,
  DollarSign,
  Package,
  Plus,
  UserCheck,
  Clock,
  Download,
  Receipt,
  CreditCard,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useAdminTheme } from "../hooks/useAdminTheme";
import type { Product } from "../data/product";
import NotificationBell from "../components/admin/NotificationBell";
import { buildDashboardNotifications } from "../utils/dashboardNotifications";
import {
  fetchSalesProducts,
  createSalesProduct,
  updateSalesProduct,
  fetchSalesPayments,
  confirmSalesPayment,
  fetchSalesCustomers,
  updateSalesOrderStatus,
  generateSalesInvoice,
  fetchSalesCategories,
  exportCsv,
  urlToImageFile,
  type AdminPayment,
  type AdminCustomer,
  type AdminCategory,
} from "../api/salesManager";

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", id: "overview" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: CreditCard, label: "Payments", id: "payments" },
  { icon: Receipt, label: "Invoices", id: "invoices" },
  { icon: FileSpreadsheet, label: "Reports", id: "reports" },
] as const;

type Tab = (typeof NAV_ITEMS)[number]["id"];

type OrderStatus = "Pending Payment" | "Processing" | "Completed" | "Cancelled";
const ORDER_STATUSES: OrderStatus[] = [
  "Pending Payment",
  "Processing",
  "Completed",
  "Cancelled",
];

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
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spending: number;
  status: "Active" | "Pending";
}
interface SalesPayment {
  id: number;
  orderId: number | null;
  customer: string;
  email: string;
  amount: number;
  method: string;
  status: "Pending" | "Paid" | "Failed";
  date: string;
}
interface SalesInvoice {
  id: string;
  orderId: number | null;
  customer: string;
  email: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  issued: string;
  due: string;
}

// Full inventory form — mirrors what UpdateProduct expects
interface InventoryForm {
  name: string;
  category: string; // category ID as a string for the <select>
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
  category: "",
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
          ?.map(
            (item) => `${item.product?.name ?? "Product"} x ${item.quantity}`,
          )
          .join(", ") || "Order items unavailable",
      total: Number(
        payment.order.total ?? payment.order.total_amount ?? payment.amount,
      ),
      paymentStatus: payment.status === "completed" ? "Paid" : "Pending",
      status: apiStatusToOrder[payment.order.status] ?? "Pending Payment",
      date: new Date(payment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
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
      payment.status === "completed"
        ? "Paid"
        : payment.status === "failed"
          ? "Failed"
          : "Pending",
    date: new Date(payment.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      orders: 0,
      spending: 0,
      status: "Active",
    });
  });
  payments.forEach((payment) => {
    if (!payment.user) return;
    const customer = customers.get(payment.user.id) ?? {
      id: String(payment.user.id),
      name: payment.user.full_name,
      email: payment.user.email,
      phone: payment.user.phone_number,
      orders: 0,
      spending: 0,
      status: "Active",
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
        month: "short",
        day: "numeric",
        year: "numeric",
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lightMode, setLightMode] = useAdminTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [payments, setPayments] = useState<SalesPayment[]>([]);
  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  // Product inventory modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | undefined>();
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] =
    useState<InventoryForm>(emptyInventoryForm);

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
      fetchSalesCategories().catch(() => [] as AdminCategory[]),
    ])
      .then(
        ([productData, paymentData, customerData, categoryData]) => {
          setProducts(productData);
          const mappedOrders = paymentsToOrders(paymentData);
          setOrders(mappedOrders);
          setPayments(paymentsToPayments(paymentData));
          setCustomers(mergeCustomers(customerData, paymentData));
          setInvoices(ordersToInvoices(mappedOrders));
          setCategories(categoryData);
        },
      )
      .catch(() =>
        setApiError("Could not load dashboard data from the backend."),
      )
      .finally(() => setLoading(false));
  }, [isSalesManager, token]);

  if (!isSalesManager) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  // ── Category name helper ─────────────────────────────────────────────────
  const categoryName = (product: Product) => {
    const match = categories.find(
      (c) => String(c.id) === String(product.category),
    );
    return match ? match.name : product.category;
  };

  // ── PRODUCT INVENTORY: open the edit modal ────────────────────────────────
  const openProductForm = (product: Product) => {
    setEditingProduct(product);
    setProductImageFile(undefined);
    setProductForm({
      name: product.name,
      category: String(product.category),
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

  // ── PRODUCT INVENTORY: open a blank modal to add a new product ────────────
  const openNewProductForm = () => {
    setEditingProduct(null);
    setProductImageFile(undefined);
    setProductForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      packaging: "",
      origin: "",
      unit: "",
      quality: "",
      imageUrl: "",
    });
    setApiError("");
    setProductModalOpen(true);
  };

  // ── PRODUCT INVENTORY: save (create or update) ────────────────────────────
  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (
      !productForm.name.trim() ||
      !productForm.category ||
      !price ||
      price <= 0 ||
      Number.isNaN(stock) ||
      stock < 0 ||
      !productForm.packaging.trim() ||
      !productForm.origin.trim() ||
      !productForm.unit.trim() ||
      !productForm.quality.trim()
    ) {
      setApiError("Complete all product fields and select a valid category.");
      return;
    }

    // A new product must ship an image — StoreProduct validates it as required.
    if (!editingProduct && !productImageFile && !productForm.imageUrl.trim()) {
      setApiError("Choose an image file or enter an image URL.");
      return;
    }

    setSavingProduct(true);
    setApiError("");
    try {
      // Resolve image: file wins, else download from URL if changed
      let image: File | undefined = productImageFile;
      const urlChanged =
        productForm.imageUrl.trim() &&
        (!editingProduct || productForm.imageUrl.trim() !== editingProduct.image);
      if (!image && urlChanged) {
        try {
          image = await urlToImageFile(productForm.imageUrl.trim());
        } catch (err: any) {
          setApiError(err.message || "The image URL could not be used.");
          setSavingProduct(false);
          return;
        }
      }

      const payload = {
        name: productForm.name.trim(),
        price,
        description: productForm.description,
        stock_quantity: stock,
        packaging_type: productForm.packaging.trim(),
        country_of_origin: productForm.origin.trim(),
        unit: productForm.unit.trim(),
        quality_type: productForm.quality.trim(),
        category_id: Number(productForm.category),
        image,
      };

      const saved = editingProduct
        ? await updateSalesProduct(token, editingProduct.id, payload)
        : await createSalesProduct(token, payload);

      setProducts((current) =>
        editingProduct
          ? current.map((p) => (p.id === saved.id ? saved : p))
          : [saved, ...current],
      );
      setProductModalOpen(false);
      setSuccessMessage(
        `"${saved.name}" ${editingProduct ? "updated" : "created"} successfully.`,
      );
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
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
    try {
      await updateSalesOrderStatus(token, orderId, orderStatusToApi[status]);
    } catch {
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId && previous
            ? { ...order, status: previous }
            : order,
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
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        due: new Date(Date.now() + 14 * 864e5).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setInvoices((current) => [newInvoice, ...current]);
      setSuccessMessage(`Invoice ${newInvoice.id} generated.`);
    } catch {
      setApiError("Could not generate the invoice.");
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const paidOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === "Paid"),
    [orders],
  );
  const revenue = useMemo(
    () => paidOrders.reduce((t, o) => t + o.total, 0),
    [paidOrders],
  );
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const pendingOrders = orders.filter(
    (o) => !["Completed", "Cancelled"].includes(o.status),
  ).length;
  const avgOrderValue = orders.length ? revenue / orders.length : 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `Fr ${revenue.toLocaleString()}`,
      change: "Live",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Total Orders",
      value: String(orders.length),
      change: "Live",
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Customers",
      value: String(customers.length),
      change: "Live",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Avg Order Value",
      value: `Fr ${Math.round(avgOrderValue).toLocaleString()}`,
      change: "Live",
      icon: TrendingUp,
      color: "text-brand",
      bg: "bg-brand/10",
    },
  ];

  const visibleProducts = products.filter((p) =>
    `${p.name} ${p.category} ${p.code}`
      .toLowerCase()
      .includes(productSearch.toLowerCase()),
  );
  const visibleOrders = orders.filter((o) =>
    `${o.id} ${o.customer} ${o.email} ${o.items} ${o.status}`
      .toLowerCase()
      .includes(orderSearch.toLowerCase()),
  );
  const visibleCustomers = customers.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase()),
  );
  const visiblePayments = payments.filter((p) =>
    `${p.id} ${p.customer} ${p.email} ${p.method} ${p.status}`
      .toLowerCase()
      .includes(paymentSearch.toLowerCase()),
  );
  const visibleInvoices = invoices.filter((i) =>
    `${i.id} ${i.customer} ${i.email} ${i.status}`
      .toLowerCase()
      .includes(invoiceSearch.toLowerCase()),
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`admin-dashboard flex min-h-screen bg-navy-deep text-white ${lightMode ? "admin-light" : ""}`}
    >
      {/* Mobile sidebar backdrop */}
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-navy-line bg-navy-dark transition-transform duration-300 lg:transition-all ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarOpen ? "lg:w-64" : "lg:w-[72px]"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-line px-5">
          <div
            className={`flex items-center gap-3 ${sidebarOpen ? "" : "lg:hidden"}`}
          >
            {/* White tile: the logo artwork has a light background, so it needs
                one to read cleanly against the dark sidebar. */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img
                src={logoImage}
                alt="Exalto"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-base font-black tracking-wide text-white">
              EXALTO
            </span>
          </div>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-ink hover:bg-navy-line hover:text-white transition lg:flex"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink hover:bg-navy-line hover:text-white transition lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {NAV_ITEMS.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setMobileNavOpen(false);
              }}
              title={!sidebarOpen ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activeTab === id
                  ? "bg-brand text-white shadow-[0_4px_20px_rgba(31,107,69,0.4)]"
                  : "text-ink hover:bg-navy-line hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={sidebarOpen ? "" : "lg:hidden"}>{label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-navy-line px-3 py-4 space-y-1">
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl bg-navy px-3 py-2.5 ${
              sidebarOpen ? "" : "lg:hidden"
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand text-xs font-bold">
              {managerEmail?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {managerEmail}
              </p>
              <p className="text-[10px] text-ink-muted">Sales Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-red-950/40 hover:text-red-400 transition"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={sidebarOpen ? "" : "lg:hidden"}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`min-w-0 flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-navy-line bg-navy-dark/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-navy-line bg-navy text-ink hover:text-white transition lg:hidden"
            >
              <Menu size={16} />
            </button>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-white sm:text-lg">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="hidden text-xs text-ink-muted sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLightMode(!lightMode)}
              aria-label={
                lightMode ? "Switch to dark mode" : "Switch to light mode"
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-line bg-navy text-ink hover:text-white transition"
            >
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <NotificationBell
              storageKey="exalto-sales-notifications-read"
              notifications={buildDashboardNotifications({
                orders,
                products,
                payments,
                customers,
              })}
              onOpenTab={(tab) => setActiveTab(tab as Tab)}
            />
            <a
              href="/"
              aria-label="View store"
              className="flex h-9 items-center justify-center gap-2 rounded-xl border border-navy-line bg-navy px-3 text-xs font-medium text-ink hover:text-white transition sm:px-4"
            >
              <span className="hidden sm:inline">View Store</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {apiError && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              <span>{apiError}</span>
              <button
                onClick={() => setApiError("")}
                className="text-red-400 hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {loading && (
            <div className="mb-6 rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-ink">
              Loading dashboard data...
            </div>
          )}

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(
                  ({ label, value, change, icon: Icon, color, bg }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-navy-line bg-navy-dark p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
                            {label}
                          </p>
                          <p className="mt-3 text-3xl font-black text-white">
                            {value}
                          </p>
                          <p className={`mt-1 text-xs font-semibold ${color}`}>
                            {change} this month
                          </p>
                        </div>
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
                        >
                          <Icon size={20} className={color} />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-line bg-navy-dark p-6">
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Sales Snapshot
                  </h3>
                  <div className="space-y-4">
                    <Row
                      icon={
                        <UserCheck size={15} className="text-emerald-400" />
                      }
                      label="Paid Orders"
                      value={paidOrders.length}
                    />
                    <Row
                      icon={<Clock size={15} className="text-ochre" />}
                      label="Pending Orders"
                      value={pendingOrders}
                    />
                    <Row
                      icon={<Package size={15} className="text-brand" />}
                      label="Completed Orders"
                      value={completedOrders}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-navy-line bg-navy-dark p-6">
                  <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Top Products
                  </h3>
                  {products.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="mb-3 flex items-center gap-4 rounded-xl border border-navy-line bg-navy p-3"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {categoryName(p)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-sm text-ink">No products yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ ORDERS ═══════════════ */}
          {activeTab === "orders" && (
            <Panel
              title="Order Management"
              subtitle={`${orders.length} customer orders`}
              search={{
                value: orderSearch,
                onChange: setOrderSearch,
                placeholder: "Search orders...",
              }}
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-navy-line">
                    {[
                      "Order",
                      "Customer",
                      "Total",
                      "Payment",
                      "Delivery Status",
                      "Invoice",
                      "Date",
                    ].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-navy-line hover:bg-navy transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">
                          {order.id}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {order.items}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">
                          {order.customer}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {order.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand">
                        Fr {order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Pill ok={order.paymentStatus === "Paid"}>
                          {order.paymentStatus}
                        </Pill>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          className="rounded-lg border border-navy-line bg-navy px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => generateInvoice(order.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-navy-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:text-brand transition"
                        >
                          <Receipt size={12} /> Generate
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleOrders.length === 0 && (
                <Empty>No orders match your search.</Empty>
              )}
            </Panel>
          )}

          {/* ═══════════════ PRODUCTS — INVENTORY MANAGEMENT ═══════════════ */}
          {activeTab === "products" && (
            <Panel
              title="Products — Inventory Management"
              subtitle="Add products, and update stock, prices, packaging and images. Deletion is admin-only."
              search={{
                value: productSearch,
                onChange: setProductSearch,
                placeholder: "Search products...",
              }}
              action={
                <button
                  onClick={openNewProductForm}
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-dark shadow-[0_4px_15px_rgba(31,107,69,0.3)]"
                >
                  <Plus size={14} /> Add Product
                </button>
              }
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-navy-line">
                    {[
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Packaging",
                      "Actions",
                    ].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-navy-line hover:bg-navy transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {p.name}
                            </p>
                            <p className="mt-0.5 text-[10px] text-ink-muted">
                              {p.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-navy-line bg-navy px-3 py-1 text-xs font-medium text-ink">
                          {categoryName(p)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand">
                        Fr {p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-medium ${p.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${p.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`}
                          />
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink">
                        {p.packaging || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openProductForm(p)}
                          aria-label={`Edit ${p.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-brand hover:text-brand transition"
                        >
                          <Edit2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleProducts.length === 0 && (
                <Empty>No products match your search.</Empty>
              )}
            </Panel>
          )}

          {/* ═══════════════ CUSTOMERS ═══════════════ */}
          {activeTab === "customers" && (
            <Panel
              title="Customer Information"
              subtitle={`${customers.length} registered clients — view only`}
              search={{
                value: customerSearch,
                onChange: setCustomerSearch,
                placeholder: "Search customers...",
              }}
            >
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-navy-line">
                    {[
                      "Customer",
                      "Contact",
                      "Orders",
                      "Total Spending",
                      "Status",
                    ].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-navy-line hover:bg-navy transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">
                          {c.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">{c.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-white">{c.email}</p>
                        <p className="mt-1 text-xs text-ink-muted">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {c.orders}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand">
                        Fr {c.spending.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Pill ok={c.status === "Active"}>{c.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleCustomers.length === 0 && (
                <Empty>No customers match your search.</Empty>
              )}
            </Panel>
          )}

          {/* ═══════════════ PAYMENTS ═══════════════ */}
          {activeTab === "payments" && (
            <Panel
              title="Payment Confirmation"
              subtitle="Confirm pending payments so orders can be fulfilled."
              search={{
                value: paymentSearch,
                onChange: setPaymentSearch,
                placeholder: "Search payments...",
              }}
            >
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-navy-line">
                    {[
                      "Payment",
                      "Order",
                      "Customer",
                      "Amount",
                      "Method",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-navy-line hover:bg-navy transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-white">#{p.id}</p>
                        <p className="mt-1 text-xs text-ink-muted">{p.date}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {p.orderId ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">
                          {p.customer}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">{p.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand">
                        Fr {p.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-white capitalize">
                        {p.method}
                      </td>
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
                          <span className="text-xs text-ink-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visiblePayments.length === 0 && (
                <Empty>No payments match your search.</Empty>
              )}
            </Panel>
          )}

          {/* ═══════════════ INVOICES ═══════════════ */}
          {activeTab === "invoices" && (
            <Panel
              title="Invoices"
              subtitle={`${invoices.length} invoices issued`}
              search={{
                value: invoiceSearch,
                onChange: setInvoiceSearch,
                placeholder: "Search invoices...",
              }}
              action={
                <button
                  onClick={() =>
                    exportCsv(
                      `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
                      [
                        "Invoice",
                        "Order",
                        "Customer",
                        "Email",
                        "Amount",
                        "Status",
                        "Issued",
                        "Due",
                      ],
                      invoices.map((i) => [
                        i.id,
                        i.orderId ?? "",
                        i.customer,
                        i.email,
                        i.amount,
                        i.status,
                        i.issued,
                        i.due,
                      ]),
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-navy-line bg-navy px-4 py-2 text-xs font-semibold text-ink hover:text-white transition"
                >
                  <Download size={13} /> Export CSV
                </button>
              }
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-navy-line">
                    {[
                      "Invoice",
                      "Order",
                      "Customer",
                      "Amount",
                      "Status",
                      "Issued",
                      "Due",
                    ].map((h) => (
                      <Th key={h}>{h}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-navy-line hover:bg-navy transition"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        {inv.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink">
                        {inv.orderId ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">
                          {inv.customer}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {inv.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand">
                        Fr {inv.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Pill ok={inv.status === "Paid"}>{inv.status}</Pill>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink">
                        {inv.issued}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink">
                        {inv.due}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleInvoices.length === 0 && (
                <Empty>No invoices yet. Generate one from an order.</Empty>
              )}
            </Panel>
          )}

          {/* ═══════════════ REPORTS ═══════════════ */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Sales Reports</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Export raw CSV data for analysis in a spreadsheet tool.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    "Paid Revenue",
                    `Fr ${revenue.toLocaleString()}`,
                    "text-emerald-400",
                  ],
                  ["Total Orders", String(orders.length), "text-blue-400"],
                  ["Pending Orders", String(pendingOrders), "text-ochre"],
                  [
                    "Completed Orders",
                    String(completedOrders),
                    "text-brand",
                  ],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-navy-line bg-navy-dark p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                      {label}
                    </p>
                    <p className={`mt-3 text-3xl font-black ${color}`}>
                      {value}
                    </p>
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
                      [
                        "Order",
                        "Customer",
                        "Email",
                        "Items",
                        "Total",
                        "Payment",
                        "Status",
                        "Date",
                      ],
                      orders.map((o) => [
                        o.id,
                        o.customer,
                        o.email,
                        o.items,
                        o.total,
                        o.paymentStatus,
                        o.status,
                        o.date,
                      ]),
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
                      [
                        "Payment",
                        "Order",
                        "Customer",
                        "Email",
                        "Amount",
                        "Method",
                        "Status",
                        "Date",
                      ],
                      payments.map((p) => [
                        p.id,
                        p.orderId ?? "",
                        p.customer,
                        p.email,
                        p.amount,
                        p.method,
                        p.status,
                        p.date,
                      ]),
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
                      [
                        "ID",
                        "Name",
                        "Email",
                        "Phone",
                        "Orders",
                        "Spending",
                        "Status",
                      ],
                      customers.map((c) => [
                        c.id,
                        c.name,
                        c.email,
                        c.phone,
                        c.orders,
                        c.spending,
                        c.status,
                      ]),
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
                      products.map((p) => [
                        p.id,
                        p.name,
                        categoryName(p),
                        p.price,
                        p.stock,
                        p.code,
                      ]),
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
                      [
                        "Invoice",
                        "Order",
                        "Customer",
                        "Email",
                        "Amount",
                        "Status",
                        "Issued",
                        "Due",
                      ],
                      invoices.map((i) => [
                        i.id,
                        i.orderId ?? "",
                        i.customer,
                        i.email,
                        i.amount,
                        i.status,
                        i.issued,
                        i.due,
                      ]),
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
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-navy-line bg-navy-dark p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Update inventory, pricing and packaging details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                aria-label="Close product form"
                className="text-ink hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Product name
                <input
                  required
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              {/* ── NEW: Category dropdown ── */}
              <label className="text-xs font-semibold text-ink">
                Category
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-ink">
                Price (RWF)
                <input
                  required
                  min="1"
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink">
                Stock quantity
                <input
                  required
                  min="0"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink">
                Packaging type
                <input
                  required
                  value={productForm.packaging}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      packaging: e.target.value,
                    })
                  }
                  placeholder="e.g. 12 bottles per carton"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink">
                Unit
                <input
                  required
                  value={productForm.unit}
                  onChange={(e) =>
                    setProductForm({ ...productForm, unit: e.target.value })
                  }
                  placeholder="e.g. 500ml bottle"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink">
                Country of origin
                <input
                  required
                  value={productForm.origin}
                  onChange={(e) =>
                    setProductForm({ ...productForm, origin: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink">
                Quality type
                <input
                  required
                  value={productForm.quality}
                  onChange={(e) =>
                    setProductForm({ ...productForm, quality: e.target.value })
                  }
                  placeholder="e.g. Grade A"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Replace image (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={(e) => setProductImageFile(e.target.files?.[0])}
                  className="mt-2 block w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                />
                <span className="mt-1 block text-[11px] font-normal text-ink-muted">
                  Leave blank to keep the current image. You can also paste a
                  new URL below.
                </span>
              </label>

              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Image URL
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) =>
                    setProductForm({ ...productForm, imageUrl: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>

              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-xl border border-navy-line px-5 py-3 text-sm font-semibold text-ink hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
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
    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
      {children}
    </th>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-6 py-10 text-center text-sm text-ink">{children}</p>
  );
}

function Pill({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        ok
          ? "bg-emerald-400/10 text-emerald-400"
          : "bg-ochre/10 text-ochre"
      }`}
    >
      {children}
    </span>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-ink">
        {icon}
        {label}
      </span>
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
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  };
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-line px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          {search && (
            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder}
                className="w-full rounded-xl border border-navy-line bg-navy py-2.5 pl-9 pr-4 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
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
    <div className="flex flex-col rounded-2xl border border-navy-line bg-navy-dark p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="mt-1 flex-1 text-xs text-ink">{description}</p>
      <button
        onClick={onExport}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition shadow-[0_4px_15px_rgba(31,107,69,0.3)]"
      >
        <Download size={13} /> Export CSV
      </button>
    </div>
  );
}
