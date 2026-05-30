import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Inventory } from '../products/entities/inventory.entity';
import { ShippingAddress } from '../shipping/entities/shipping-address.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ShippingAddress)
    private addressRepository: Repository<ShippingAddress>,
    private cartService: CartService,
    private dataSource: DataSource,
  ) {}

  async createOrder(
    user: User,
    payload: {
      addressId: string;
      courierName: string;
      courierService: string;
      shippingCost: number;
      couponCode?: string;
      notes?: string;
    },
  ): Promise<Order> {
    const { addressId, courierName, courierService, shippingCost, couponCode, notes } = payload;

    // Load active cart
    const cart = await this.cartService.getCart(user);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cannot place an order with an empty cart');
    }

    // Load selected shipping address
    const shippingAddress = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: user.id } },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    // Generate Transaction Runner for SQL ACID Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotal = 0;
      let totalWeight = 0;
      const orderItemsToSave: OrderItem[] = [];

      // Validate products, stock, and calculate subtotal/weight
      for (const item of cart.items) {
        // Reload product to check fresh inventory with locking (pessimistic_write) to avoid race conditions
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.product.id, isActive: true },
          relations: { inventory: true },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.product.name} is no longer available`);
        }

        let variant: ProductVariant | null = null;
        if (item.variant) {
          variant = await queryRunner.manager.findOne(ProductVariant, {
            where: { id: item.variant.id },
            relations: { inventory: true },
            lock: { mode: 'pessimistic_write' },
          });

          if (!variant) {
            throw new NotFoundException(`Selected variant for ${product.name} is no longer available`);
          }
        }

        const inventory = variant ? variant.inventory : product.inventory;
        if (!inventory || (inventory.quantity - inventory.reserved) < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}${variant ? ` (${variant.name})` : ''}. Only ${
              inventory ? inventory.quantity - inventory.reserved : 0
            } items available.`,
          );
        }

        // Calculate item price and weight snapshot
        const unitPrice = variant ? Number(variant.price) : Number(product.price);
        const itemSubtotal = unitPrice * item.quantity;
        const itemWeight = (variant ? variant.weight : product.weight) * item.quantity;

        subtotal += itemSubtotal;
        totalWeight += itemWeight;

        // Reserve stock in DB
        inventory.reserved += item.quantity;
        await queryRunner.manager.save(Inventory, inventory);

        // Build OrderItem snapshot
        const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || '';
        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          productName: product.name,
          productImage: primaryImage,
          price: unitPrice,
          quantity: item.quantity,
          variantName: variant ? variant.name : undefined,
          weight: variant ? variant.weight : product.weight,
        });

        orderItemsToSave.push(orderItem);
      }

      // Process discount coupon (simple validation for mock checkout, expansion in Coupon module)
      let discount = 0;
      if (couponCode) {
        // TBD Coupon Code loading and validation
        discount = 0; 
      }

      const total = subtotal + Number(shippingCost) - discount;
      const orderNumber = `FTC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

      // Create Order
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        user,
        status: OrderStatus.PENDING,
        subtotal,
        shippingCost,
        discount,
        total,
        couponCode,
        notes,
        courierName,
        courierService,
        shippingAddress,
        items: orderItemsToSave,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Clear Customer Cart items
      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });

      // Commit transaction
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      // Rollback transaction on failure
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async getMyOrders(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: {
        items: {
          product: {
            images: true,
          },
        },
        payment: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderDetail(orderId: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: {
        items: {
          product: {
            images: true,
          },
        },
        payment: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrderTracking(orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        trackingNumber: true,
        courierName: true,
        courierService: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Build status history list for progress indicator
    const history = [
      { status: OrderStatus.PENDING, label: 'Pesanan Dibuat', done: true, time: order.updatedAt },
      { status: OrderStatus.WAITING_PAYMENT, label: 'Menunggu Pembayaran', done: order.status !== OrderStatus.PENDING },
      { status: OrderStatus.PAID, label: 'Pembayaran Diterima', done: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status) },
      { status: OrderStatus.PROCESSING, label: 'Pesanan Diproses', done: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status) },
      { status: OrderStatus.SHIPPED, label: 'Pesanan Dikirim', done: [OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status) },
      { status: OrderStatus.DELIVERED, label: 'Pesanan Selesai', done: order.status === OrderStatus.DELIVERED },
    ];

    return {
      order,
      history,
    };
  }

  // ==================== ADMIN ENDPOINTS ====================

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        user: true,
        payment: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: { product: { inventory: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const prevStatus = order.status;
    order.status = status;

    // Handle inventory transitions (e.g. Paid -> Deduct reserved stock, Cancelled -> Release reserved stock)
    if (status === OrderStatus.CANCELLED && prevStatus !== OrderStatus.CANCELLED) {
      // Release inventory reservations
      for (const item of order.items) {
        const product = item.product;
        if (product && product.inventory) {
          product.inventory.reserved = Math.max(0, product.inventory.reserved - item.quantity);
          await this.dataSource.getRepository(Inventory).save(product.inventory);
        }
      }
    } else if (status === OrderStatus.PAID && prevStatus === OrderStatus.PENDING) {
      // Deduct reserved stock and decrease absolute quantity
      for (const item of order.items) {
        const product = item.product;
        if (product && product.inventory) {
          product.inventory.reserved = Math.max(0, product.inventory.reserved - item.quantity);
          product.inventory.quantity = Math.max(0, product.inventory.quantity - item.quantity);
          await this.dataSource.getRepository(Inventory).save(product.inventory);
        }
      }
    }

    return this.orderRepository.save(order);
  }

  async inputTrackingNumber(orderId: string, courierName: string, courierService: string, trackingNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.courierName = courierName;
    order.courierService = courierService;
    order.trackingNumber = trackingNumber;
    order.status = OrderStatus.SHIPPED;

    return this.orderRepository.save(order);
  }
}
