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
import { Role } from './role.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { ShippingAddress } from '../../shipping/entities/shipping-address.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password?: string;

  @Column({ type: 'varchar', length: 64, select: false, nullable: true })
  salt?: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', type: 'varchar', length: 500, nullable: true, select: false })
  refreshToken?: string | null;

  @Column({ name: 'phone_verified', type: 'boolean', default: false })
  phoneVerified: boolean;

  @Column({ name: 'google_id', type: 'varchar', length: 255, nullable: true, unique: true })
  googleId?: string;

  @Column({ name: 'facebook_id', type: 'varchar', length: 255, nullable: true, unique: true })
  facebookId?: string;

  @Column({ name: 'instagram_id', type: 'varchar', length: 255, nullable: true, unique: true })
  instagramId?: string;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Wishlist, (w) => w.user)
  wishlists: Wishlist[];

  @OneToMany(() => ShippingAddress, (a) => a.user)
  addresses: ShippingAddress[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];
}
