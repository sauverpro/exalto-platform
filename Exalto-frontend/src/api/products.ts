import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";
const BASE_URL = "http://127.0.0.1:8000";

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  description: string;
  image: string;
  category_id: number;
  status: string;
  is_featured: boolean;
  stock_quantity: number;
  packaging_type: string;
  unit: string;
  country_of_origin: string;
  quality_type: string;
  created_at: string;
  updated_at: string;
}

// Resolve image URL — backend stores relative paths like "images/products/file.jpg"
export function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await axios.get(`${API_URL}/products`);
  return res.data?.data ?? [];
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await axios.get(`${API_URL}/product/${slug}`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}
