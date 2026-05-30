import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_name', length: 255 })
  productName: string; // Snapshot in case product name changes

  @Column({ name: 'product_image', length: 255, nullable: true })
  productImage: string; // Snapshot of primary image

  @Column('decimal', { precision: 12, scale: 2 })
  price: number; // Snapshot of price at purchase time

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'variant_name', nullable: true, length: 100 })
  variantName: string; // Snapshot variant name, e.g. "200g"

  @Column({ default: 0 })
  weight: number; // Weight in grams (snapshot)
}
