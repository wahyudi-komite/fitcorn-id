import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', nullable: true, length: 255 })
  sessionId: string; // For guest users before they log in

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
