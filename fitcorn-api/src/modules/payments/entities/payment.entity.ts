import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ length: 50 })
  provider: string; // 'midtrans' | 'xendit'

  @Column({ name: 'external_id', type: 'varchar', nullable: true, length: 255 })
  externalId?: string | null; // Reference id in Midtrans/Xendit

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  method?: string | null; // 'qris', 'bca_va', etc.

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('json', { nullable: true, name: 'gateway_response' })
  gatewayResponse?: object | null;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt?: Date | null;

  @Column({ name: 'payment_url', type: 'varchar', nullable: true, length: 500 })
  paymentUrl?: string | null; // Token URL or redirect URL

  @Column({ name: 'va_number', type: 'varchar', nullable: true, length: 100 })
  vaNumber?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
