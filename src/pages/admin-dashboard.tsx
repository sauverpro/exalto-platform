import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo-image.png";
import {
  LogOut,
  Menu,
  X,
  BarChart3,
  ShoppingBag,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Sun,
  Moon,
  Search,
  Image,
  LayoutTemplate,
  Upload,
  Trash,
  FolderTree,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useAdminTheme } from "../hooks/useAdminTheme";
import CmsEditor from "../components/admin/CmsEditor";
import NotificationBell from "../components/admin/NotificationBell";
import { buildDashboardNotifications } from "../utils/dashboardNotifications";
import { CMS_SCHEMA } from "../data/siteContent";
import {
  createProduct,
  fetchAdminCustomers,
  fetchAdminPayments,
  fetchAdminProducts,
  fetchCategories,
  updateOrderStatus as updateOrderStatusApi,
  updateProduct,
  deleteProduct as deleteProductApi,
  createCategory,
  updateCategory,
  deleteCategory,
  type AdminCategory,
  type AdminCustomer as AdminCustomerRecord,
  type AdminPayment,
} from "../api/admin";
import type { Product } from "../data/product";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", id: "overview" },
  { icon: FolderTree, label: "Categories", id: "categories" },
  { icon: ShoppingBag, label: "Products", id: "products" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: LayoutTemplate, label: "CMS Screens", id: "cms" },
  { icon: Image, label: "Media Library", id: "media" },
  { icon: Settings, label: "Settings", id: "settings" },
] as const;

type Tab = (typeof NAV_ITEMS)[number]["id"];

type OrderStatus = "Pending Payment" | "Processing" | "Completed" | "Cancelled";

interface AdminOrder {
  id: number;
  customer: string;
  email: string;
  items: string;
  total: number;
  paymentStatus: "Pending" | "Paid";
  status: OrderStatus;
  date: string;
}

const ORDER_STATUSES: OrderStatus[] = [
  "Pending Payment",
  "Processing",
  "Completed",
  "Cancelled",
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

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: "image";
}

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

function paymentsToOrders(payments: AdminPayment[]): AdminOrder[] {
  const orders = new Map<number, AdminOrder>();
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

function mergeCustomers(
  customersData: AdminCustomerRecord[],
  payments: AdminPayment[],
): AdminCustomer[] {
  const customers = new Map<number, AdminCustomer>();
  customersData.forEach((customer) => {
    customers.set(customer.id, {
      id: String(customer.id),
      name: customer.full_name,
      company: "",
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
      company: "",
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

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminDashboard() {
  const { user, token, logout: logoutAdmin } = useUser();
  const isAdminLoggedIn =
    !!user && (user.role === "admin" || user.role === "sales_manager");
  const isAdmin = user?.role === "admin";
  const dashboardNav = NAV_ITEMS.filter(
    ({ id }) =>
      isAdmin ||
      ["overview", "products", "orders", "customers", "analytics"].includes(id),
  );
  const adminEmail = user?.email ?? null;
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  // CMS Screens opens a submenu of site pages (Home, About, ...) in the sidebar.
  const [cmsMenuOpen, setCmsMenuOpen] = useState(false);
  const [cmsPage, setCmsPage] = useState(CMS_SCHEMA[0].id);
  // Stock switch on the products table: rows mid-save, and each product's
  // stock before it was switched off (so switching on can restore it).
  const [stockTogglePending, setStockTogglePending] = useState<number[]>([]);
  const [previousStock, setPreviousStock] = useState<Record<number, number>>({});
  const [lightMode, setLightMode] = useAdminTheme();

  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | undefined>();
  const [productSaving, setProductSaving] = useState(false);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");

  // ── Categories state ─────────────────────────────────────────────────────
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");

  // Create / Edit modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [categorySaving, setCategorySaving] = useState(false);

  // Delete confirmation modal
  const [deletingCategory, setDeletingCategory] =
    useState<AdminCategory | null>(null);
  const [categoryDeleting, setCategoryDeleting] = useState(false);

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const savedMedia = localStorage.getItem("exalto-admin-media");
      return savedMedia ? (JSON.parse(savedMedia) as MediaAsset[]) : [];
    } catch {
      return [];
    }
  });
  const [mediaUrl, setMediaUrl] = useState("");


  const [adminSettings, setAdminSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("exalto-admin-settings");
      return savedSettings
        ? JSON.parse(savedSettings)
        : {
            companyName: "Exalto Engineering & Supply Solutions Ltd",
            currency: "RWF",
            hours: "Mon - Sun: 8:00 AM - 9:00 PM",
            emailNotifications: true,
          };
    } catch {
      return {
        companyName: "Exalto Engineering & Supply Solutions Ltd",
        currency: "RWF",
        hours: "Mon - Sun: 8:00 AM - 9:00 PM",
        emailNotifications: true,
      };
    }
  });

  const [productForm, setProductForm] = useState({
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
  });

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !isAdminLoggedIn) return;
    setLoading(true);
    Promise.all([
      fetchAdminProducts(token),
      fetchAdminPayments(token),
      fetchAdminCustomers(token),
      fetchCategories(),
    ])
      .then(([productData, paymentData, customerData, categoryData]) => {
        setAdminProducts(productData);
        setOrders(paymentsToOrders(paymentData));
        setCustomers(mergeCustomers(customerData, paymentData));
        setCategories(categoryData);
      })
      .catch(() =>
        setApiError("Could not load dashboard data from the backend."),
      )
      .finally(() => setLoading(false));
  }, [isAdminLoggedIn, token]);

  // ── LocalStorage persistence ──────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("exalto-admin-media", JSON.stringify(mediaAssets));
  }, [mediaAssets]);


  useEffect(() => {
    localStorage.setItem(
      "exalto-admin-settings",
      JSON.stringify(adminSettings),
    );
  }, [adminSettings]);

  // ── Auto-dismiss category success ────────────────────────────────────────
  useEffect(() => {
    if (!categorySuccess) return;
    const t = setTimeout(() => setCategorySuccess(""), 3000);
    return () => clearTimeout(t);
  }, [categorySuccess]);

  if (!isAdminLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  // ── Product modal ────────────────────────────────────────────────────────
  const openProductForm = (product?: Product) => {
    if (!product && categories.length === 0) {
      setApiError("Create at least one category before adding products.");
      setActiveTab("categories");
      return;
    }
    setEditingProduct(product ?? null);
    setProductImageFile(undefined);
    setProductForm(
      product
        ? {
            name: product.name,
            category: product.category,
            price: String(product.price),
            stock: String(product.stock),
            description: product.description,
            packaging: product.packaging,
            origin: product.origin,
            unit: product.unit,
            quality: product.grade,
            imageUrl: product.image,
          }
        : {
            name: "",
            category: categories[0] ? String(categories[0].id) : "",
            price: "",
            stock: "",
            description: "",
            packaging: "",
            origin: "Rwanda",
            unit: "",
            quality: "Grade A",
            imageUrl: "",
          },
    );
    setProductModalOpen(true);
  };

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (
      !productForm.name.trim() ||
      !productForm.category ||
      !price ||
      stock < 0 ||
      !productForm.packaging.trim() ||
      !productForm.origin.trim() ||
      !productForm.unit.trim() ||
      !productForm.quality.trim()
    ) {
      setApiError("Complete all product fields and select a valid category.");
      return;
    }

    if (
      !token ||
      (!editingProduct && !productImageFile && !productForm.imageUrl.trim())
    ) {
      setApiError("Choose an image file or enter an image URL.");
      return;
    }

    setProductSaving(true);
    setApiError("");
    try {
      let image = productImageFile;
      const imageUrlChanged =
        productForm.imageUrl.trim() &&
        (!editingProduct ||
          productForm.imageUrl.trim() !== editingProduct.image);
      if (!image && imageUrlChanged) {
        const response = await fetch(productForm.imageUrl.trim());
        if (!response.ok)
          throw new Error("The image URL could not be downloaded.");
        const blob = await response.blob();
        if (!blob.type.startsWith("image/"))
          throw new Error("The URL does not point to an image.");
        const extension = blob.type.split("/")[1] || "jpg";
        image = new File([blob], `product-image.${extension}`, {
          type: blob.type,
        });
      }

      const data = {
        name: productForm.name.trim(),
        price,
        description: productForm.description,
        category_id: Number(productForm.category),
        stock_quantity: stock,
        packaging_type: productForm.packaging.trim(),
        country_of_origin: productForm.origin.trim(),
        unit: productForm.unit.trim(),
        quality_type: productForm.quality.trim(),
        image,
      };

      const saved = editingProduct
        ? await updateProduct(token, editingProduct.id, data)
        : await createProduct(token, data);

      setAdminProducts((current) =>
        editingProduct
          ? current.map((product) =>
              product.id === saved.id ? saved : product,
            )
          : [saved, ...current],
      );
      setProductModalOpen(false);
    } catch (error: any) {
      const validationErrors = error.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : "";
      setApiError(
        validationMessage ||
          error.message ||
          error.response?.data?.message ||
          "Could not save the product.",
      );
    } finally {
      setProductSaving(false);
    }
  };

  // ── Stock switch ──────────────────────────────────────────────────────────
  // "Out of stock" is stock 0. The amount a product had before being switched
  // off is remembered so switching it back on restores it.
  const toggleStock = async (product: Product) => {
    if (!token) return;
    const turningOn = product.stock <= 0;
    let nextStock = 0;

    if (turningOn) {
      const remembered = previousStock[product.id];
      if (remembered && remembered > 0) {
        nextStock = remembered;
      } else {
        const answer = window.prompt(
          `How many units of "${product.name}" are in stock?`,
          "1",
        );
        if (answer === null) return; // cancelled
        nextStock = Math.floor(Number(answer));
        if (!Number.isFinite(nextStock) || nextStock <= 0) {
          setApiError("Enter a stock quantity greater than 0.");
          return;
        }
      }
    } else {
      setPreviousStock((current) => ({ ...current, [product.id]: product.stock }));
    }

    setStockTogglePending((current) => [...current, product.id]);
    setAdminProducts((current) =>
      current.map((p) => (p.id === product.id ? { ...p, stock: nextStock } : p)),
    );
    try {
      const saved = await updateProduct(token, product.id, {
        name: product.name,
        price: product.price,
        description: product.description,
        category_id: Number(product.category),
        stock_quantity: nextStock,
        packaging_type: product.packaging,
        country_of_origin: product.origin,
        unit: product.unit,
        quality_type: product.grade,
      });
      setAdminProducts((current) =>
        current.map((p) => (p.id === saved.id ? saved : p)),
      );
    } catch {
      // Put the old stock back so the switch shows the truth.
      setAdminProducts((current) =>
        current.map((p) => (p.id === product.id ? product : p)),
      );
      setApiError(`Could not update the stock for ${product.name}.`);
    } finally {
      setStockTogglePending((current) => current.filter((id) => id !== product.id));
    }
  };

  const deleteProduct = async (productId: number) => {
    if (window.confirm("Delete this product from the admin list?") && token) {
      try {
        await deleteProductApi(token, productId);
        setAdminProducts((current) =>
          current.filter((product) => product.id !== productId),
        );
      } catch {
        setApiError("Could not delete the product.");
      }
    }
  };

  const visibleProducts = adminProducts.filter((product) =>
    `${product.name} ${product.category} ${product.code}`
      .toLowerCase()
      .includes(productSearch.toLowerCase()),
  );

  const visibleOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.email} ${order.items} ${order.status}`
      .toLowerCase()
      .includes(orderSearch.toLowerCase()),
  );

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    if (!token) return;
    try {
      await updateOrderStatusApi(token, orderId, orderStatusToApi[status]);
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch {
      setApiError("Could not update the order status.");
    }
  };

  const visibleCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.company} ${customer.email} ${customer.phone}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase()),
  );

  const addMediaAsset = (url: string, name: string) => {
    if (!url.trim()) return;
    setMediaAssets((current) => [
      ...current,
      {
        id: `MED-${Date.now()}`,
        name: name || "Uploaded image",
        url,
        type: "image",
      },
    ]);
    setMediaUrl("");
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        addMediaAsset(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((total, order) => total + order.total, 0);
  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;
  const pendingOrders = orders.filter(
    (order) => !["Completed", "Cancelled"].includes(order.status),
  ).length;

  const stats = [
    {
      label: "Total Revenue",
      value: `Fr ${revenue.toLocaleString()}`,
      change: "Live",
      icon: ShoppingBag,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Total Products",
      value: String(adminProducts.length),
      change: "Live",
      icon: ShoppingBag,
      color: "text-brand",
      bg: "bg-brand/10",
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
  ];

  // ── Category handlers ────────────────────────────────────────────────────
  const openCategoryForm = (category?: AdminCategory) => {
    setEditingCategory(category ?? null);
    setCategoryForm(
      category
        ? {
            name: category.name,
            description: category.description ?? "",
          }
        : { name: "", description: "" },
    );
    setApiError("");
    setCategoryModalOpen(true);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = categoryForm.name.trim();
    const description = categoryForm.description.trim();

    if (!token || !name) {
      setApiError("Enter a category name.");
      return;
    }

    setCategorySaving(true);
    setApiError("");
    try {
      const saved = editingCategory
        ? await updateCategory(token, editingCategory.id, { name, description })
        : await createCategory(token, { name, description });

      setCategories((current) =>
        editingCategory
          ? current.map((c) => (c.id === saved.id ? saved : c))
          : [...current, saved],
      );

      setCategorySuccess(
        editingCategory
          ? `Category "${saved.name}" updated.`
          : `Category "${saved.name}" created.`,
      );
      setCategoryModalOpen(false);
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : "";
      setApiError(
        validationMessage ||
          error?.response?.data?.message ||
          "Could not save the category.",
      );
    } finally {
      setCategorySaving(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!token || !deletingCategory) return;
    setCategoryDeleting(true);
    try {
      await deleteCategory(token, deletingCategory.id);
      setCategories((current) =>
        current.filter((c) => c.id !== deletingCategory.id),
      );
      setCategorySuccess(`Category "${deletingCategory.name}" deleted.`);
      setDeletingCategory(null);
    } catch {
      setApiError("Could not delete the category.");
    } finally {
      setCategoryDeleting(false);
    }
  };

  const visibleCategories = categories.filter((c) =>
    `${c.name} ${c.slug} ${c.description ?? ""}`
      .toLowerCase()
      .includes(categorySearch.toLowerCase()),
  );

  const categoryName = (product: Product) => {
    const match = categories.find(
      (c) => String(c.id) === String(product.category),
    );
    return match ? match.name : product.category;
  };

  const categoryProductCount = (categoryId: number) =>
    adminProducts.filter((p) => String(p.category) === String(categoryId))
      .length;

  // Shared by the products table (desktop) and the product cards (mobile).
  const renderStockSwitch = (p: Product) => {
    const inStock = p.stock > 0;
    const pending = stockTogglePending.includes(p.id);
    return (
      <button
        type="button"
        role="switch"
        aria-checked={inStock}
        aria-label={`${p.name}: ${inStock ? "in stock" : "out of stock"}`}
        disabled={pending}
        onClick={() => toggleStock(p)}
        title={inStock ? `${p.stock} in stock — click to mark out of stock` : "Click to mark in stock"}
        className="flex items-center gap-2.5 disabled:cursor-wait disabled:opacity-60"
      >
        <span
          className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
            inStock ? "bg-emerald-500" : "bg-gray-400"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              inStock ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </span>
        <span
          className={`text-xs font-medium ${
            inStock ? "text-emerald-500" : "text-ink-muted"
          }`}
        >
          {pending ? "Saving..." : inStock ? "In Stock" : "Out of Stock"}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`admin-dashboard flex min-h-screen bg-navy-deep text-white ${
        lightMode ? "admin-light" : ""
      }`}
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
        <div
          className={`flex h-16 items-center justify-between border-b border-navy-line px-5 ${
            sidebarOpen ? "" : "lg:justify-center lg:px-0"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              sidebarOpen ? "" : "lg:hidden"
            }`}
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
          {dashboardNav.map(({ icon: Icon, label, id }) => (
            <div key={id}>
              <button
                onClick={() => {
                  setActiveTab(id);
                  if (id === "cms") {
                    // Toggle the page list; keep the mobile drawer open so a
                    // page can be picked from it.
                    setCmsMenuOpen((open) => (activeTab === "cms" ? !open : true));
                  } else {
                    setMobileNavOpen(false);
                  }
                }}
                title={!sidebarOpen ? label : undefined}
                aria-expanded={id === "cms" ? cmsMenuOpen : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  activeTab === id
                    ? "bg-brand text-white shadow-[0_4px_20px_rgba(31,107,69,0.4)]"
                    : "text-ink hover:bg-navy-line hover:text-white"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className={`flex-1 text-left ${sidebarOpen ? "" : "lg:hidden"}`}>
                  {label}
                </span>
                {id === "cms" && (
                  <ChevronDown
                    size={15}
                    className={`flex-shrink-0 transition-transform ${
                      cmsMenuOpen ? "rotate-180" : ""
                    } ${sidebarOpen ? "" : "lg:hidden"}`}
                  />
                )}
              </button>

              {id === "cms" && cmsMenuOpen && (
                <div
                  className={`mt-1 ml-5 space-y-1 border-l border-navy-line pl-3 ${
                    sidebarOpen ? "" : "lg:hidden"
                  }`}
                >
                  {CMS_SCHEMA.map((page) => {
                    const current = activeTab === "cms" && cmsPage === page.id;
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          setActiveTab("cms");
                          setCmsPage(page.id);
                          setMobileNavOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          current
                            ? "bg-brand/15 font-semibold text-brand"
                            : "text-ink hover:bg-navy-line hover:text-white"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                            current ? "bg-brand" : "bg-ink-muted"
                          }`}
                        />
                        {page.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-navy-line px-3 py-4 space-y-1">
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl bg-navy px-3 py-2.5 ${
              sidebarOpen ? "" : "lg:hidden"
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand text-xs font-bold">
              {adminEmail?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {adminEmail}
              </p>
              <p className="text-[10px] text-ink-muted">
                {isAdmin ? "Administrator" : "Sales Manager"}
              </p>
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
                {activeTab === "cms" && (
                  <span className="font-medium text-ink">
                    {" "}
                    · {CMS_SCHEMA.find((p) => p.id === cmsPage)?.label}
                  </span>
                )}
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
              title={lightMode ? "Dark mode" : "Light mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-line bg-navy text-ink hover:text-white transition"
            >
              {lightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <NotificationBell
              storageKey="exalto-admin-notifications-read"
              notifications={buildDashboardNotifications({
                orders,
                products: adminProducts,
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
          {loading && (
            <div className="mb-6 rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-ink">
              Loading dashboard data...
            </div>
          )}

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                {stats.map(
                  ({ label, value, change, icon: Icon, color, bg }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-navy-line bg-navy-dark p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
                            {label}
                          </p>
                          <p className="mt-3 break-words text-2xl font-black text-white sm:text-3xl">
                            {value}
                          </p>
                          <p className={`mt-1 text-xs font-semibold ${color}`}>
                            {change} this month
                          </p>
                        </div>
                        <div
                          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}
                        >
                          <Icon size={20} className={color} />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Featured Products
                  </h3>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {adminProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl border border-navy-line bg-navy p-3 sm:gap-4 sm:p-4"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {categoryName(p)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-brand">
                          Fr {p.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-navy-line p-6 text-center text-sm text-ink sm:p-8">
                Activity will appear here when the backend provides an activity
                endpoint.
              </div>
            </div>
          )}

          {/* ═══════════════ CATEGORIES ═══════════════ */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              {categorySuccess && (
                <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
                  <span>{categorySuccess}</span>
                  <button
                    onClick={() => setCategorySuccess("")}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-line px-4 py-4 sm:px-6 sm:py-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                      All Categories
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">
                      {categories.length} categor
                      {categories.length === 1 ? "y" : "ies"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-72">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                      />
                      <input
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full rounded-xl border border-navy-line bg-navy py-2.5 pl-9 pr-4 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
                      />
                    </div>
                    <button
                      onClick={() => openCategoryForm()}
                      className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition shadow-[0_4px_15px_rgba(31,107,69,0.3)]"
                    >
                      + Add Category
                    </button>
                  </div>
                </div>

                {/* Mobile: one card per category */}
                <div className="divide-y divide-navy-line md:hidden">
                  {visibleCategories.map((category) => {
                    const productCount = categoryProductCount(category.id);
                    return (
                      <div key={category.id} className="flex items-start gap-3 px-4 py-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {category.name}{" "}
                            <span className="text-xs font-normal text-ink-muted">
                              #{category.id}
                            </span>
                          </p>
                          <code className="mt-1 inline-block max-w-full truncate rounded-lg border border-navy-line bg-navy px-2 py-0.5 text-[11px] text-brand">
                            {category.slug}
                          </code>
                          {category.description && (
                            <p className="mt-2 line-clamp-2 text-xs text-ink">
                              {category.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-ink-muted">
                            {productCount} product{productCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 gap-2">
                          <button
                            onClick={() => openCategoryForm(category)}
                            aria-label={`Edit ${category.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-brand hover:text-brand transition"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingCategory(category)}
                            aria-label={`Delete ${category.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-red-800 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-navy-line">
                        {[
                          "ID",
                          "Name",
                          "Slug",
                          "Description",
                          "Products",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleCategories.map((category) => {
                        const productCount = categoryProductCount(category.id);
                        return (
                          <tr
                            key={category.id}
                            className="border-b border-navy-line hover:bg-navy transition"
                          >
                            <td className="px-6 py-4 text-sm text-ink">
                              #{category.id}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-white">
                              {category.name}
                            </td>
                            <td className="px-6 py-4">
                              <code className="rounded-lg border border-navy-line bg-navy px-3 py-1 text-xs text-brand">
                                {category.slug}
                              </code>
                            </td>
                            <td className="max-w-xs truncate px-6 py-4 text-xs text-ink">
                              {category.description || "—"}
                            </td>
                            <td className="px-6 py-4 text-sm text-ink">
                              {productCount} product
                              {productCount === 1 ? "" : "s"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openCategoryForm(category)}
                                  aria-label={`Edit ${category.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-brand hover:text-brand transition"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => setDeletingCategory(category)}
                                  aria-label={`Delete ${category.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-red-800 hover:text-red-400 transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {visibleCategories.length === 0 && (
                  <p className="px-6 py-10 text-center text-sm text-ink">
                    No categories yet. Click "+ Add Category" to create your
                    first one.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════ PRODUCTS ═══════════════ */}
          {activeTab === "products" && (
            <div className="rounded-2xl border border-navy-line bg-navy-dark overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-navy-line px-4 py-4 sm:px-6 sm:py-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                  All Products
                </h3>
                {isAdmin && (
                  <button
                    onClick={() => openProductForm()}
                    className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark transition shadow-[0_4px_15px_rgba(31,107,69,0.3)]"
                  >
                    + Add Product
                  </button>
                )}
              </div>
              <div className="border-b border-navy-line px-4 py-4 sm:px-6">
                <input
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-navy-line bg-navy px-4 py-2.5 text-sm text-white placeholder-ink-muted outline-none focus:border-brand sm:max-w-sm"
                />
              </div>

              {/* Mobile: one card per product */}
              <div className="divide-y divide-navy-line md:hidden">
                {visibleProducts.map((p) => (
                  <div key={p.id} className="flex gap-3 px-4 py-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-sm font-semibold text-white">
                          {p.name}
                        </p>
                        <div className="flex flex-shrink-0 gap-2">
                          <button
                            onClick={() => openProductForm(p)}
                            aria-label={`Edit ${p.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-brand hover:text-brand transition"
                          >
                            <Edit2 size={13} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => deleteProduct(p.id)}
                              aria-label={`Delete ${p.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-red-800 hover:text-red-400 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-bold text-brand">
                          Fr {p.price.toLocaleString()}
                        </span>
                        <span className="rounded-full border border-navy-line bg-navy px-2.5 py-0.5 text-[11px] font-medium text-ink">
                          {categoryName(p)}
                        </span>
                      </div>
                      <div className="mt-3">{renderStockSwitch(p)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy-line">
                      {[
                        "Product",
                        "Category",
                        "Price",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted"
                        >
                          {h}
                        </th>
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
                            <span className="text-sm font-semibold text-white">
                              {p.name}
                            </span>
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
                        <td className="px-6 py-4">{renderStockSwitch(p)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openProductForm(p)}
                              aria-label={`Edit ${p.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-brand hover:text-brand transition"
                            >
                              <Edit2 size={13} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => deleteProduct(p.id)}
                                aria-label={`Delete ${p.name}`}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-line text-ink hover:border-red-800 hover:text-red-400 transition"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleProducts.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-ink">
                  No products match your search.
                </p>
              )}
            </div>
          )}

          {/* ═══════════════ ORDERS ═══════════════ */}
          {activeTab === "orders" && (
            <div className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-line px-4 py-4 sm:px-6 sm:py-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Order Management
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {orders.length} customer orders
                  </p>
                </div>
                <input
                  value={orderSearch}
                  onChange={(event) => setOrderSearch(event.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-xl border border-navy-line bg-navy px-4 py-2.5 text-sm text-white placeholder-ink-muted outline-none focus:border-brand sm:max-w-xs"
                />
              </div>

              {/* Mobile: one card per order */}
              <div className="divide-y divide-navy-line lg:hidden">
                {visibleOrders.map((order) => (
                  <div key={order.id} className="space-y-3 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">
                          Order #{order.id}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {order.date}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-ochre/10 text-ochre"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {order.customer}
                      </p>
                      {order.email && (
                        <p className="truncate text-xs text-ink-muted">
                          {order.email}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-ink">{order.items}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-brand">
                        Fr {order.total.toLocaleString()}
                      </span>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        aria-label={`Delivery status for order ${order.id}`}
                        className="rounded-lg border border-navy-line bg-navy px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-navy-line">
                      {[
                        "Order",
                        "Customer",
                        "Total",
                        "Payment",
                        "Delivery Status",
                        "Date",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted"
                        >
                          {heading}
                        </th>
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
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.paymentStatus === "Paid"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-ochre/10 text-ochre"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                event.target.value as OrderStatus,
                              )
                            }
                            className="rounded-lg border border-navy-line bg-navy px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-ink">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleOrders.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-ink">
                  No orders match your search.
                </p>
              )}
            </div>
          )}

          {/* ═══════════════ CUSTOMERS ═══════════════ */}
          {activeTab === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-line px-4 py-4 sm:px-6 sm:py-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Customer Management
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {customers.length} registered clients
                  </p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  />
                  <input
                    value={customerSearch}
                    onChange={(event) => setCustomerSearch(event.target.value)}
                    placeholder="Search customers..."
                    className="w-full rounded-xl border border-navy-line bg-navy py-2.5 pl-9 pr-4 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
                  />
                </div>
              </div>
              {/* Mobile: one card per customer */}
              <div className="divide-y divide-navy-line lg:hidden">
                {visibleCustomers.map((customer) => (
                  <div key={customer.id} className="space-y-2 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {customer.name}
                        </p>
                        {customer.company && (
                          <p className="text-xs text-ink">{customer.company}</p>
                        )}
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-ochre/10 text-ochre"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs text-white">
                        {customer.email}
                      </p>
                      <p className="text-xs text-ink-muted">{customer.phone}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-ink">
                        <span className="font-bold text-white">
                          {customer.orders}
                        </span>{" "}
                        order{customer.orders === 1 ? "" : "s"}
                      </span>
                      <span className="text-sm font-bold text-brand">
                        Fr {customer.spending.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-navy-line">
                      {[
                        "Customer",
                        "Company",
                        "Contact",
                        "Orders",
                        "Total Spending",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-navy-line hover:bg-navy transition"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-white">
                            {customer.name}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            {customer.id}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-ink">
                          {customer.company}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-white">{customer.email}</p>
                          <p className="mt-1 text-xs text-ink-muted">
                            {customer.phone}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          {customer.orders}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-brand">
                          Fr {customer.spending.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              customer.status === "Active"
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-ochre/10 text-ochre"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleCustomers.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-ink">
                  No customers match your search.
                </p>
              )}
            </div>
          )}

          {/* ═══════════════ ANALYTICS ═══════════════ */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Sales Analytics
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  A frontend preview of your store performance.
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
                    className="rounded-2xl border border-navy-line bg-navy-dark p-5 sm:p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                      {label}
                    </p>
                    <p className={`mt-3 break-words text-2xl font-black sm:text-3xl ${color}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                  <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Order Status
                  </h4>
                  {ORDER_STATUSES.map((status) => {
                    const count = orders.filter(
                      (order) => order.status === status,
                    ).length;
                    return (
                      <div key={status} className="mb-4">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-ink">{status}</span>
                          <span className="font-bold text-white">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-navy">
                          <div
                            className="h-2 rounded-full bg-brand transition-all"
                            style={{
                              width: `${
                                orders.length
                                  ? (count / orders.length) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                  <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                    Inventory Snapshot
                  </h4>
                  {adminProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="mb-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {categoryName(product)}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 text-sm font-bold ${
                          product.stock > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ CMS ═══════════════ */}
          {activeTab === "cms" && (
            <CmsEditor activePage={cmsPage} onPageChange={setCmsPage} />
          )}

          {/* ═══════════════ MEDIA LIBRARY ═══════════════ */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Media Library</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Upload images or add images from an online URL.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-navy-line bg-navy-dark p-5 sm:flex-row">
                <input
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => addMediaAsset(mediaUrl, "Online image")}
                  className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark"
                >
                  <Image size={16} className="mr-2 inline" />
                  Add URL
                </button>
                <label className="cursor-pointer rounded-xl border border-navy-line px-5 py-3 text-center text-sm font-bold text-ink hover:border-brand hover:text-white">
                  <Upload size={16} className="mr-2 inline" />
                  Browse
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              {mediaAssets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-navy-line p-12 text-center text-sm text-ink">
                  No media assets yet.
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {mediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="overflow-hidden rounded-2xl border border-navy-line bg-navy-dark"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="h-36 w-full object-cover"
                      />
                      <div className="flex items-center justify-between gap-2 p-3">
                        <p className="truncate text-xs text-white">
                          {asset.name}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setMediaAssets((current) =>
                              current.filter((item) => item.id !== asset.id),
                            )
                          }
                          aria-label={`Delete ${asset.name}`}
                          className="text-ink hover:text-red-400"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ SETTINGS ═══════════════ */}
          {activeTab === "settings" && (
            <div className="max-w-xl space-y-6">
              <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={adminEmail ?? ""}
                      disabled
                      className="w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-ink outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white placeholder-ink-muted outline-none transition focus:border-brand focus:ring-1 focus:ring-brand/50"
                    />
                  </div>
                  <button className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark transition shadow-[0_4px_15px_rgba(31,107,69,0.3)]">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Store Settings
                </h3>
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-ink">
                    Company name
                    <input
                      value={adminSettings.companyName}
                      onChange={(event) =>
                        setAdminSettings({
                          ...adminSettings,
                          companyName: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-ink">
                      Currency
                      <select
                        value={adminSettings.currency}
                        onChange={(event) =>
                          setAdminSettings({
                            ...adminSettings,
                            currency: event.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                      >
                        <option>RWF</option>
                        <option>USD</option>
                        <option>EUR</option>
                      </select>
                    </label>
                    <label className="block text-xs font-semibold text-ink">
                      Opening hours
                      <input
                        value={adminSettings.hours}
                        onChange={(event) =>
                          setAdminSettings({
                            ...adminSettings,
                            hours: event.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                      />
                    </label>
                  </div>
                  <label className="flex items-center gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={adminSettings.emailNotifications}
                      onChange={(event) =>
                        setAdminSettings({
                          ...adminSettings,
                          emailNotifications: event.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-brand"
                    />{" "}
                    Email notifications enabled
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-navy-line bg-navy-dark p-4 sm:p-6">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Danger Zone
                </h3>
                <p className="mb-4 text-xs text-ink-muted">
                  These actions are irreversible. Please proceed with caution.
                </p>
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

      {/* ═══════════════ PRODUCT MODAL ═══════════════ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3 py-4 sm:px-5 sm:py-8">
          <form
            onSubmit={saveProduct}
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-navy-line bg-navy-dark p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-white">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
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
              <label className="text-xs font-semibold text-ink">
                Product name
                <input
                  required
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm({ ...productForm, name: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                Category
                <select
                  required
                  value={productForm.category}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      category: event.target.value,
                    })
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
                Price
                <input
                  required
                  min="1"
                  type="number"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      price: event.target.value,
                    })
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
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      stock: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Product image {editingProduct ? "(optional)" : ""}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={(event) =>
                    setProductImageFile(event.target.files?.[0])
                  }
                  className="mt-2 block w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
                />
              </label>
              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Image URL (optional)
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      imageUrl: event.target.value,
                    })
                  }
                  placeholder="https://example.com/product.jpg"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
                />
                <span className="mt-1 block text-[11px] font-normal text-ink-muted">
                  Use a file or URL. A new product needs one of them.
                </span>
              </label>
              <label className="text-xs font-semibold text-ink">
                Packaging type
                <input
                  required
                  value={productForm.packaging}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      packaging: event.target.value,
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
                  onChange={(event) =>
                    setProductForm({ ...productForm, unit: event.target.value })
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
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      origin: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                Quality type
                <input
                  required
                  value={productForm.quality}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      quality: event.target.value,
                    })
                  }
                  placeholder="e.g. Grade A"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm({
                      ...productForm,
                      description: event.target.value,
                    })
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-xl border border-navy-line px-5 py-3 text-sm font-semibold text-ink hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={productSaving}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {productSaving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════ CATEGORY MODAL (Add / Edit) ═══════════════ */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3 py-4 sm:px-5 sm:py-8">
          <form
            onSubmit={saveCategory}
            className="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-navy-line bg-navy-dark p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  {editingCategory
                    ? "Update the category name and description."
                    : "Create a new product category."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                aria-label="Close category form"
                className="text-ink hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-ink">
                Category name
                <input
                  required
                  autoFocus
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="e.g. Fresh Juices"
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                Slug preview
                <input
                  type="text"
                  readOnly
                  value={slugify(categoryForm.name)}
                  className="mt-2 w-full rounded-xl border border-navy-line bg-navy/60 px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
            </div>

            <label className="mt-4 block text-xs font-semibold text-ink">
              Description (optional)
              <textarea
                rows={4}
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Short description of what belongs in this category..."
                className="mt-2 w-full resize-y rounded-xl border border-navy-line bg-navy px-4 py-3 text-sm text-white placeholder-ink-muted outline-none focus:border-brand"
              />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="rounded-xl border border-navy-line px-5 py-3 text-sm font-semibold text-ink hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={categorySaving || !categoryForm.name.trim()}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {categorySaving
                  ? "Saving..."
                  : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════ DELETE CONFIRMATION MODAL ═══════════════ */}
      {deletingCategory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-3 py-4 sm:px-5 sm:py-8">
          <div className="w-full max-w-md rounded-2xl border border-navy-line bg-navy-dark p-5 shadow-2xl sm:p-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-950/40 text-red-400">
                <Trash2 size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white">
                  Delete category?
                </h2>
                <p className="mt-1 text-xs text-ink">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-navy-line bg-navy p-4">
              <p className="text-xs text-ink">You are about to delete:</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {deletingCategory.name}
              </p>
              <p className="mt-2 text-xs text-ink">
                <code className="rounded-md border border-navy-line bg-navy-dark px-2 py-0.5 text-[11px] text-brand">
                  {deletingCategory.slug}
                </code>
              </p>
              {categoryProductCount(deletingCategory.id) > 0 && (
                <div className="mt-3 rounded-lg border border-ochre/40 bg-ochre/10 px-3 py-2 text-xs text-ochre">
                  ⚠ {categoryProductCount(deletingCategory.id)} product
                  {categoryProductCount(deletingCategory.id) === 1
                    ? ""
                    : "s"}{" "}
                  in this category will be <strong>disabled</strong> (not
                  deleted). They will disappear from the storefront.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={categoryDeleting}
                className="rounded-xl border border-navy-line px-5 py-3 text-sm font-semibold text-ink hover:text-white disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={categoryDeleting}
                className="rounded-xl border border-red-900/50 bg-red-950/40 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-950/60 transition disabled:opacity-60"
              >
                {categoryDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
