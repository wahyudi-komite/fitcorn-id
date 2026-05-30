import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { Inventory } from './inventory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true, name: 'short_description' })
  shortDescription: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true, name: 'sale_price' })
  salePrice: number;

  @Column({ default: 0 })
  weight: number; // grams

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'sold_count', default: 0 })
  soldCount: number;

  @Column({ nullable: true, name: 'meta_title', length: 255 })
  metaTitle: string;

  @Column('text', { nullable: true, name: 'meta_description' })
  metaDescription: string;

  @Column({ nullable: true, length: 255 })
  sku: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => ProductCategory, (c) => c.products, { eager: true })
  @JoinTable({
    name: 'product_category_map',
    joinColumn: { name: 'product_id' },
    inverseJoinColumn: { name: 'category_id' },
  })
  categories: ProductCategory[];

  @OneToMany(() => ProductImage, (img) => img.product, { eager: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (v) => v.product, { eager: true })
  variants: ProductVariant[];

  @OneToOne(() => Inventory, (inv) => inv.product, { eager: true, nullable: true })
  inventory: Inventory;
}
