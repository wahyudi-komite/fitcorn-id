import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'], default: 'percentage' })
  type: string;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number; // Discount value (either percentage like 10.00 or fixed like 20000.00)

  @Column('decimal', { precision: 12, scale: 2, name: 'min_purchase', default: 0 })
  minPurchase: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'max_discount', nullable: true })
  maxDiscount: number; // Cap for percentage discount

  @Column({ name: 'usage_limit', nullable: true })
  usageLimit: number;

  @Column({ name: 'used_count', default: 0 })
  usedCount: number;

  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
