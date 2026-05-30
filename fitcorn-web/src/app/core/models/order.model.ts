export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  courierName?: string;
  courierService?: string;
  items: OrderItem[];
  payment?: Payment;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  WAITING_PAYMENT = 'waiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variantName?: string;
  weight: number;
}

export interface Payment {
  id: string;
  provider: string;
  status: PaymentStatus;
  method: string;
  amount: number;
  paymentUrl?: string;
  vaNumber?: string;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  village: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
}
