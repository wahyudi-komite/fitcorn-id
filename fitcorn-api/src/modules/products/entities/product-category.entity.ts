import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
