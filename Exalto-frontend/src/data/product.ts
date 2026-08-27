import passionJuice from "../assets/passion-juice.jpg";
import sugarcaneWine from "../assets/sugarcane-wine.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "La Vie Passion Juice",
    price: 9000,
    image: passionJuice,
    description: "A bright, naturally refreshing passion fruit drink made from locally sourced fruit.",
    category: "Juice",
  },
  {
    id: 2,
    name: "Vicas Sugarcane Wine",
    price: 12000,
    image: sugarcaneWine,
    description: "A smooth, vibrant wine crafted from Rwanda's finest sugarcane.",
    category: "Natural wine",
  },
];
