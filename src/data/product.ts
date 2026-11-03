/**
 * The shape the whole store UI works in.
 *
 * Backend responses (`ApiProduct`) are mapped into this by `toStoreProduct`
 * in `api/products.ts` and `toAdminProduct` in `api/admin.ts` — if you add a
 * field here, add it to both mappers.
 *
 * This file previously also exported a `products` mock array; the app now
 * loads everything from the API, so only the type remains. The old mock data
 * is still in git history at commit e467241 if it is ever needed again.
 */
export interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  wholesalePrice: number;
  exportPrice: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  variety: string;
  unit: string;
  stock: number;
  grade: string;
  exportAvailable: boolean;
  featured: boolean;
  packaging: string;
  origin: string;
}
