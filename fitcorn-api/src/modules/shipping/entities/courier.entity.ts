import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShippingRate } from './shipping-rate.entity';

@Entity('couriers')
export class Courier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string; // 'jne', 'jnt', 'sicepat', 'anteraja', 'pos'

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  logo: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ShippingRate, (rate) => rate.courier)
  rates: ShippingRate[];
}
