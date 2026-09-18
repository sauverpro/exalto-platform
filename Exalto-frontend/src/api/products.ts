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

export function toStoreProduct(product: ApiProduct): import("../data/product").Product {
  const image = resolveImage(product.image);
  return {
    id: product.id,
    name: product.name,
    code: `EX-${String(product.id).padStart(3, "0")}`,
    price: Number(product.price),
    wholesalePrice: Number(product.price),
    exportPrice: Number(product.price),
    image,
    images: [image],
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

export async function fetchStoreProducts(): Promise<import("../data/product").Product[]> {
  const products = await fetchProducts();
  return products.map(toStoreProduct);
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await axios.get(`${API_URL}/product/${slug}`);
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}
