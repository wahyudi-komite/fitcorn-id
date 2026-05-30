import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true, length: 255 })
  subtitle: string;

  @Column({ name: 'image_url', length: 255 })
  imageUrl: string;

  @Column({ name: 'mobile_image_url', nullable: true, length: 255 })
  mobileImageUrl: string;

  @Column({ name: 'link_url', nullable: true, length: 255 })
  linkUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;
}
