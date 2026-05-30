import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.inventory, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(() => ProductVariant, (variant) => variant.inventory, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'product_variant_id' })
  variant: ProductVariant;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  reserved: number;

  @Column({ name: 'low_stock_threshold', default: 5 })
  lowStockThreshold: number;
}
