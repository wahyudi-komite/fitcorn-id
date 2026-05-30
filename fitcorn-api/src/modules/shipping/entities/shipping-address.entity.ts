import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('shipping_addresses')
export class ShippingAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  province: string;

  @Column({ name: 'province_id', length: 50 })
  provinceId: string; // RajaOngkir province id

  @Column({ length: 100 })
  city: string;

  @Column({ name: 'city_id', length: 50 })
  cityId: string; // RajaOngkir city id

  @Column({ length: 100 })
  district: string;

  @Column({ length: 100 })
  village: string;

  @Column({ name: 'postal_code', length: 10 })
  postalCode: string;

  @Column('text', { name: 'full_address' })
  fullAddress: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
