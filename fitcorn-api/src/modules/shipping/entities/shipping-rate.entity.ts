import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Courier } from './courier.entity';

@Entity('shipping_rates')
export class ShippingRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Courier, (courier) => courier.rates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courier_id' })
  courier: Courier;

  @Column({ length: 100 })
  service: string; // 'REG', 'YES', 'OKE', etc.

  @Column('decimal', { precision: 12, scale: 2 })
  cost: number;

  @Column({ length: 50, nullable: true })
  etd: string; // e.g. "2-3 hari"
}
