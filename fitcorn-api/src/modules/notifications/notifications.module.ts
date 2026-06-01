import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { AbandonedCartScheduler } from './abandoned-cart.scheduler';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Order } from '../orders/entities/order.entity';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Cart, Order]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [NotificationsService, NotificationsProcessor, AbandonedCartScheduler, WhatsAppService],
  exports: [NotificationsService, WhatsAppService],
})
export class NotificationsModule {}
