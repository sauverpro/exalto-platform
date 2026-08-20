import passionJuice from "../assets/passion-juice.jpg";
import sugarcaneWine from "../assets/sugarcane-wine.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "La Vie Passion Juice",
    price: 9000,
    image: passionJuice,
  },
  {
    id: 2,
    name: "Vicas Sugarcane Wine",
    price: 12000,
    image: sugarcaneWine,
  },
];
