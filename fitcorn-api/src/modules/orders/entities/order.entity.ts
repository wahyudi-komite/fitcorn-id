import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ShippingAddress } from '../../shipping/entities/shipping-address.entity';

export enum OrderStatus {
  PENDING = 'pending',
  WAITING_PAYMENT = 'waiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true, length: 100 })
  orderNumber: string; // e.g. FTC-20260530-XXXX

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'shipping_cost' })
  shippingCost: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ name: 'coupon_code', nullable: true, length: 50 })
  couponCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'tracking_number', nullable: true, length: 100 })
  trackingNumber: string;

  @Column({ name: 'courier_name', nullable: true, length: 100 })
  courierName: string;

  @Column({ name: 'courier_service', nullable: true, length: 100 })
  courierService: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  payment: Payment;

  @ManyToOne(() => ShippingAddress, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: ShippingAddress;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
