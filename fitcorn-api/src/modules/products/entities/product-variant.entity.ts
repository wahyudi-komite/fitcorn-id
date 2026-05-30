import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Inventory } from './inventory.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ length: 100 })
  name: string; // "100g", "200g", "500g"

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ default: 0 })
  weight: number; // weight in grams

  @Column({ nullable: true, length: 100 })
  sku: string;

  @OneToOne(() => Inventory, (inventory) => inventory.variant, { cascade: true })
  inventory: Inventory;
}
