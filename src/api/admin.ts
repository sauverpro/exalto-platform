import axios from "axios";
import { resolveImage, type ApiProduct } from "./products";
import { compressImage } from "../utils/compressImage";
import type { Product } from "../data/product";

const API_URL = "http://127.0.0.1:8000/api";

const authConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  // Present on the backend Category model ($fillable) and written by
  // createCategory/updateCategory, but older rows may not have one.
  description?: string;
}

export const fetchCategories = async (): Promise<AdminCategory[]> => {
  const response = await axios.get<{ data: AdminCategory[] }>(`${API_URL}/category/all`);
  return response.data.data ?? [];
};

export interface AdminPayment {
  id: number;
  amount: string | number;
  status: "pending" | "completed" | "failed" | "refunded";
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

export interface AdminCustomer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: "client";
  created_at: string;
}

export const fetchAdminCustomers = async (token: string): Promise<AdminCustomer[]> => {
  const response = await axios.get<{ data: AdminCustomer[] }>(`${API_URL}/admin/customers`, authConfig(token));
  return response.data.data ?? [];
};

export const toAdminProduct = (product: ApiProduct): Product => ({
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
});

export const fetchAdminProducts = async (token: string): Promise<Product[]> => {
  const response = await axios.get<{ data: ApiProduct[] }>(`${API_URL}/products/all`, authConfig(token));
  return (response.data.data ?? []).map(toAdminProduct);
};

export interface ProductWriteData {
  name: string;
  price: number;
  description: string;
  category_id: number;
  stock_quantity: number;
  packaging_type: string;
  country_of_origin: string;
  unit: string;
  quality_type: string;
  image?: File;
}

async function productFormData(data: ProductWriteData): Promise<FormData> {
  const formData = new FormData();
  // Shrink the image first — PHP silently drops uploads over upload_max_filesize.
  const payload = data.image
    ? { ...data, image: await compressImage(data.image) }
    : data;
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value instanceof File ? value : String(value));
  });
  return formData;
}

export const createProduct = async (token: string, data: ProductWriteData): Promise<Product> => {
  const response = await axios.post<{ data: ApiProduct }>(`${API_URL}/product/store`, await productFormData(data), authConfig(token));
  return toAdminProduct(response.data.data);
};

export const fetchAdminPayments = async (token: string): Promise<AdminPayment[]> => {
  const response = await axios.get<{ data: AdminPayment[] }>(`${API_URL}/payments/admin`, authConfig(token));
  return response.data.data ?? [];
};

export const updateProduct = async (
  token: string,
  id: number,
  data: ProductWriteData,
): Promise<Product> => {
  const formData = await productFormData(data);
  formData.append("_method", "PUT");
  const response = await axios.post<{ data: ApiProduct }>(`${API_URL}/product/update/${id}`, formData, authConfig(token));
  return toAdminProduct(response.data.data);
};

export const deleteProduct = async (token: string, id: number): Promise<void> => {
  await axios.delete(`${API_URL}/product/delete/${id}`, authConfig(token));
};

export const updateOrderStatus = async (token: string, id: number, status: string): Promise<void> => {
  await axios.put(`${API_URL}/order/status/${id}`, { status }, authConfig(token));
};

export interface CategoryWrite {
  name: string;
  description?: string;
}

//Category related functions
export const createCategory = async (
  token: string,
  data: CategoryWrite,
): Promise<AdminCategory> => {
  const response = await axios.post<{ data: AdminCategory }>(
    `${API_URL}/category/store`,
    { name: data.name, description: data.description ?? "" },
    authConfig(token),
  );
  return response.data.data;
};

export const updateCategory = async (
  token: string,
  id: number,
  data: CategoryWrite,
): Promise<AdminCategory> => {
  const response = await axios.post<{ data: AdminCategory }>(
    `${API_URL}/category/update/${id}`,
    { name: data.name, description: data.description ?? "" },
    authConfig(token),
  );
  return response.data.data;
};

export const deleteCategory = async (
  token: string,
  id: number,
): Promise<void> => {
  await axios.delete(`${API_URL}/category/delete/${id}`, authConfig(token));
};