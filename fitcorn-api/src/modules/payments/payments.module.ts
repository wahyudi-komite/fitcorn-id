import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { Inventory } from '../products/entities/inventory.entity';
import { MidtransProvider } from './providers/midtrans.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, Inventory]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MidtransProvider],
  exports: [PaymentsService, MidtransProvider],
})
export class PaymentsModule {}
