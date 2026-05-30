import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User; // Admin who performed the action

  @Column({ length: 100 })
  action: string; // e.g., 'create_product', 'update_order_status'

  @Column({ name: 'entity_type', length: 100 })
  entityType: string; // e.g., 'Product', 'Order'

  @Column({ name: 'entity_id', nullable: true, length: 100 })
  entityId: string;

  @Column({ type: 'json', nullable: true, name: 'old_values' })
  oldValues: object;

  @Column({ type: 'json', nullable: true, name: 'new_values' })
  newValues: object;

  @Column({ name: 'ip_address', nullable: true, length: 45 })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
