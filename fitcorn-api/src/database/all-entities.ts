import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/users/entities/role.entity';
import { Permission } from '../modules/users/entities/permission.entity';
import { Product } from '../modules/products/entities/product.entity';
import { ProductCategory } from '../modules/products/entities/product-category.entity';
import { ProductImage } from '../modules/products/entities/product-image.entity';
import { ProductVariant } from '../modules/products/entities/product-variant.entity';
import { Inventory } from '../modules/products/entities/inventory.entity';
import { Cart } from '../modules/cart/entities/cart.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { Wishlist } from '../modules/wishlist/entities/wishlist.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Payment } from '../modules/payments/entities/payment.entity';
import { ShippingAddress } from '../modules/shipping/entities/shipping-address.entity';
import { Courier } from '../modules/shipping/entities/courier.entity';
import { ShippingRate } from '../modules/shipping/entities/shipping-rate.entity';
import { Banner } from '../modules/banners/entities/banner.entity';
import { InstagramGallery } from '../modules/banners/entities/instagram-gallery.entity';
import { Coupon } from '../modules/coupons/entities/coupon.entity';
import { Setting } from '../modules/settings/entities/setting.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { AuditLog } from '../modules/admin/entities/audit-log.entity';

export const ALL_ENTITIES = [
  User,
  Role,
  Permission,
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
  Inventory,
  Cart,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
  Payment,
  ShippingAddress,
  Courier,
  ShippingRate,
  Banner,
  InstagramGallery,
  Coupon,
  Setting,
  Notification,
  AuditLog,
];
