import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true, length: 50 })
  type: string; // 'string' | 'number' | 'boolean' | 'json'

  @Column({ name: 'setting_group', nullable: true, length: 50 })
  group: string; // 'general' | 'payment' | 'shipping' | 'seo'
}
