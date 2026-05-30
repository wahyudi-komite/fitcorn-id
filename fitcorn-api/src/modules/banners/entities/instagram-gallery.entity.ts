import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('instagram_gallery')
export class InstagramGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_url', length: 255 })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ name: 'post_url', length: 255 })
  postUrl: string; // URL of the Instagram post to link to when clicked

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
