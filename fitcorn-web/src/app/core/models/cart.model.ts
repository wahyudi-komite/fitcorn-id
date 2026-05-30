import { Product, ProductVariant } from './product.model';

export interface Cart {
  id: string;
  user?: { id: string };
  sessionId?: string;
  items: CartItem[];
  updatedAt: string;
}

export interface CartItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
