import passionJuice from "../assets/passion-juice.jpg";
import sugarcaneWine from "../assets/sugarcane-wine.jpg";

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

export const products: Product[] = [
  {
    id: 1,
    name: "La Vie Passion Juice",
    code: "EX-JU-001",
    price: 9000,
    wholesalePrice: 7500,
    exportPrice: 10500,
    image: passionJuice,
    images: [
      passionJuice,
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A bright, naturally refreshing passion fruit drink cold-pressed from locally sourced fruit. Rich in vitamins C and A, with no artificial additives or preservatives. Perfect for daily consumption and hospitality service.",
    category: "Juice",
    variety: "Passion Fruit",
    unit: "500ml Bottle",
    stock: 240,
    grade: "Grade A",
    exportAvailable: true,
    featured: true,
    packaging: "Glass bottle, 12 per carton",
    origin: "Kamonyi, Rwanda",
  },
  {
    id: 2,
    name: "Vicas Sugarcane Wine",
    code: "EX-WN-001",
    price: 12000,
    wholesalePrice: 10000,
    exportPrice: 14000,
    image: sugarcaneWine,
    images: [
      sugarcaneWine,
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
    ],
    description: "A smooth, vibrant natural wine crafted from Rwanda's finest sugarcane. Lightly fermented with a clean, crisp finish. No artificial flavours. Ideal for celebrations, restaurants, and export markets.",
    category: "Natural Wine",
    variety: "Sugarcane",
    unit: "750ml Bottle",
    stock: 180,
    grade: "Grade A",
    exportAvailable: true,
    featured: true,
    packaging: "Glass bottle, 6 per carton",
    origin: "Kamonyi, Rwanda",
  },
  {
    id: 3,
    name: "La Vie Passion Juice — Family Pack",
    code: "EX-JU-002",
    price: 32000,
    wholesalePrice: 27000,
    exportPrice: 38000,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
      passionJuice,
    ],
    description: "A carton of 4 x 1-litre passion fruit juice bottles. Perfect for families, events, and small businesses. Same cold-pressed quality, bigger value.",
    category: "Juice",
    variety: "Passion Fruit",
    unit: "4 × 1L Carton",
    stock: 95,
    grade: "Grade A",
    exportAvailable: true,
    featured: false,
    packaging: "Carton of 4 bottles",
    origin: "Kamonyi, Rwanda",
  },
  {
    id: 4,
    name: "Vicas Sugarcane Wine — Bulk Box",
    code: "EX-WN-002",
    price: 65000,
    wholesalePrice: 55000,
    exportPrice: 75000,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
      sugarcaneWine,
    ],
    description: "A wholesale box of 6 x 750ml sugarcane wine bottles. Designed for restaurants, hotels, and retail distributors. Competitive bulk pricing with consistent Grade A quality.",
    category: "Natural Wine",
    variety: "Sugarcane",
    unit: "6 × 750ml Box",
    stock: 60,
    grade: "Grade A",
    exportAvailable: true,
    featured: false,
    packaging: "Export carton, 6 bottles",
    origin: "Kamonyi, Rwanda",
  },
  {
    id: 5,
    name: "Mixed Beverage Gift Set",
    code: "EX-GF-001",
    price: 25000,
    wholesalePrice: 21000,
    exportPrice: 29000,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
      passionJuice,
      sugarcaneWine,
    ],
    description: "A premium gift set featuring one bottle of La Vie Passion Juice and one bottle of Vicas Sugarcane Wine. Beautifully packaged — perfect for corporate gifts, celebrations, and special occasions.",
    category: "Gift Sets",
    variety: "Mixed",
    unit: "Gift Box (2 bottles)",
    stock: 45,
    grade: "Grade A",
    exportAvailable: true,
    featured: true,
    packaging: "Premium gift box",
    origin: "Kamonyi, Rwanda",
  },
  {
    id: 6,
    name: "Passion Juice — Export Carton",
    code: "EX-JU-003",
    price: 95000,
    wholesalePrice: 82000,
    exportPrice: 110000,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
      passionJuice,
    ],
    description: "Export-grade carton of 12 x 500ml passion fruit juice bottles. Certified for international markets. Includes phytosanitary certificate and certificate of origin. Minimum order 10 cartons.",
    category: "Export Produce",
    variety: "Passion Fruit",
    unit: "12 × 500ml Carton",
    stock: 30,
    grade: "Export Grade",
    exportAvailable: true,
    featured: false,
    packaging: "Export carton, 12 bottles",
    origin: "Kamonyi, Rwanda",
  },
];

export const categories = ["All", "Juice", "Natural Wine", "Gift Sets", "Export Produce"];
