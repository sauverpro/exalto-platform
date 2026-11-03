import axios from "axios";
import { resolveImage, type ApiProduct } from "./products";
import type { Product } from "../data/product";
import { compressImage } from "../utils/compressImage";

const API_URL = "http://127.0.0.1:8000/api";

const authConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/* ─────────────────────────────────────────────────────────────────────────────
 * Products — Sales Manager can VIEW, CREATE and UPDATE.
 * (Delete stays admin-only: ProductController::DeleteProduct requires isAdmin().)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Shape the product form sends to the backend (matches ProductController). */
export interface SalesProductWrite {
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  packaging_type: string;
  country_of_origin: string;
  unit: string;
  quality_type: string;
  category_id: number;
  image?: File;
}
/* ─────────────────────────────────────────────────────────────────────────────
 * Categories — public endpoint, used to populate the edit-product dropdown
 * ───────────────────────────────────────────────────────────────────────────── */

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export async function fetchSalesCategories(): Promise<AdminCategory[]> {
  const response = await axios.get<{ data: AdminCategory[] }>(
    `${API_URL}/category/all`,
  );
  return response.data.data ?? [];
}

/** Map the API product into the frontend `Product` shape. */
export function mapSalesProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    code: `EX-${String(product.id).padStart(3, "0")}`,
    price: Number(product.price),
    wholesalePrice: Number(product.price),
    exportPrice: Number(product.price),
    image: resolveImage(product.image),
    images: [resolveImage(product.image)],
    description: product.description,
    category: String(product.category_id),
    variety: "",
    unit: product.unit,
    stock: product.stock_quantity,
    grade: product.quality_type,
    exportAvailable: true,
    featured: product.is_featured,
    packaging: product.packaging_type,
    origin: product.country_of_origin,
  };
}

/** GET /products/all — backend allows admin + sales_manager. */
export async function fetchSalesProducts(token: string): Promise<Product[]> {
  const response = await axios.get<{ data: ApiProduct[] }>(
    `${API_URL}/products/all`,
    authConfig(token),
  );
  return (response.data.data ?? []).map(mapSalesProduct);
}

/**
 * UPDATE product — the backend accepts admin + sales_manager.
 * The existing controller validates a mis-typed `county_of_origin` field,
 * so we send both spellings to be compatible with the current backend.
 */
/** Build the multipart body shared by create and update. */
async function salesProductForm(data: SalesProductWrite): Promise<FormData> {
  const form = new FormData();
  form.append("name", data.name);
  form.append("price", String(data.price));
  form.append("description", data.description);
  form.append("stock_quantity", String(data.stock_quantity));
  form.append("packaging_type", data.packaging_type);
  form.append("unit", data.unit);
  form.append("quality_type", data.quality_type);
  form.append("category_id", String(data.category_id));
  form.append("country_of_origin", data.country_of_origin);
  if (data.image) form.append("image", await compressImage(data.image));
  return form;
}

export async function createSalesProduct(
  token: string,
  data: SalesProductWrite,
): Promise<Product> {
  const response = await axios.post<{ data: ApiProduct }>(
    `${API_URL}/product/store`,
    await salesProductForm(data),
    authConfig(token),
  );
  return mapSalesProduct(response.data.data);
}

export async function updateSalesProduct(
  token: string,
  id: number,
  data: SalesProductWrite,
): Promise<Product> {
  const form = new FormData();
  form.append("_method", "PUT"); // Laravel method spoofing for multipart
  form.append("name", data.name);
  form.append("price", String(data.price));
  form.append("description", data.description);
  form.append("stock_quantity", String(data.stock_quantity));
  form.append("packaging_type", data.packaging_type);
  form.append("unit", data.unit);
  form.append("quality_type", data.quality_type);
  form.append("category_id", String(data.category_id));
  form.append("country_of_origin", data.country_of_origin);
  if (data.image) form.append("image", await compressImage(data.image));

  const response = await axios.post<{ data: ApiProduct }>(
    `${API_URL}/product/update/${id}`,
    form,
    authConfig(token),
  );
  return mapSalesProduct(response.data.data);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Payments
 * ───────────────────────────────────────────────────────────────────────────── */

export interface AdminPayment {
  id: number;
  amount: string | number;
  status: "pending" | "completed" | "failed" | "refunded";
  method?: string;
  created_at: string;
  order: {
    id: number;
    status: string;
    total: string | number;
    total_amount?: string | number;
    order_items?: Array<{
      quantity: number;
      product: { name: string } | null;
    }>;
  } | null;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
  } | null;
}

export async function fetchSalesPayments(token: string): Promise<AdminPayment[]> {
  const response = await axios.get<{ data: AdminPayment[] }>(
    `${API_URL}/payments/admin`,
    authConfig(token),
  );
  return response.data.data ?? [];
}

/**
 * Confirm a pending payment.
 * Adjust the URL if your backend uses a different route.
 */
export async function confirmSalesPayment(
  token: string,
  paymentId: number,
): Promise<void> {
  await axios.put(
    `${API_URL}/payment/admin/update/${paymentId}`,
    { status: "completed" },
    authConfig(token),
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Customers
 * ───────────────────────────────────────────────────────────────────────────── */

export interface AdminCustomer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: "client";
  created_at: string;
}

export async function fetchSalesCustomers(token: string): Promise<AdminCustomer[]> {
  const response = await axios.get<{ data: AdminCustomer[] }>(
    `${API_URL}/admin/customers`,
    authConfig(token),
  );
  return response.data.data ?? [];
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Orders
 * ───────────────────────────────────────────────────────────────────────────── */

export async function updateSalesOrderStatus(
  token: string,
  id: number,
  status: string,
): Promise<void> {
  await axios.put(`${API_URL}/order/status/${id}`, { status }, authConfig(token));
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Quotations
 * ───────────────────────────────────────────────────────────────────────────── */

export interface AdminQuotation {
  id: number;
  reference?: string;
  company_name: string;
  country: string;
  products_summary?: string;
  quantity?: string;
  schedule?: string;
  status: string;
  created_at: string;
}

export async function fetchSalesQuotations(
  token: string,
): Promise<AdminQuotation[]> {
  const response = await axios.get<{ data: AdminQuotation[] }>(
    `${API_URL}/admin/quotations`,
    authConfig(token),
  );
  return response.data.data ?? [];
}

export async function updateSalesQuotationStatus(
  token: string,
  quotationId: string,
  status: string,
): Promise<void> {
  await axios.patch(
    `${API_URL}/admin/quotations/${quotationId}/status`,
    { status },
    authConfig(token),
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Invoices
 * ───────────────────────────────────────────────────────────────────────────── */

export interface AdminInvoice {
  id: number;
  reference: string;
  order_id: number | null;
  amount: number;
  status: string;
  issued_at: string;
  due_at: string;
}

export async function generateSalesInvoice(
  token: string,
  orderId: number,
): Promise<AdminInvoice> {
  const response = await axios.post<AdminInvoice>(
    `${API_URL}/admin/invoices`,
    { order_id: orderId },
    authConfig(token),
  );
  return response.data;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────────────────────────────────────── */

/** Download an image URL into a File so the multipart POST can carry it. */
export async function urlToImageFile(url: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("The image URL could not be downloaded.");
  const blob = await response.blob();
  if (!blob.type.startsWith("image/"))
    throw new Error("The URL does not point to an image.");
  const ext = blob.type.split("/")[1] || "jpg";
  return new File([blob], `product-image.${ext}`, { type: blob.type });
}

/** Export rows to CSV (used by Reports). */
export function exportCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}