export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  color: string;
  image: string;
  isNew: boolean;
  isHit: boolean;
  createdAt: string;
  description: string;
  specifications: Record<string, string>;
}
