import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminWhatsAppController } from '../whatsapp/whatsapp.controller';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { AuditLog } from './entities/audit-log.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product, AuditLog]),
    NotificationsModule,
  ],
  controllers: [AdminDashboardController, AdminWhatsAppController],
})
export class AdminModule {}
