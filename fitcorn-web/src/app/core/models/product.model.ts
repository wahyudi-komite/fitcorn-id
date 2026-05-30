export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  weight: number;
  isActive: boolean;
  isFeatured: boolean;
  soldCount: number;
  metaTitle?: string;
  metaDescription?: string;
  categories: ProductCategory[];
  images: ProductImage[];
  variants: ProductVariant[];
  inventory: Inventory;
  createdAt: string;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
  image?: string;
  description?: string;
  sortOrder: number;
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  weight: number;
  sku?: string;
  inventory: Inventory;
}

export interface Inventory {
  id: number;
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
}
