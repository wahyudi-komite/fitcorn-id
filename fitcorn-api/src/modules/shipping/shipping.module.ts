import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Courier } from './entities/courier.entity';
import { ShippingRate } from './entities/shipping-rate.entity';
import { User } from '../users/entities/user.entity';
import { RajaOngkirProvider } from './providers/rajaongkir.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingAddress, Courier, ShippingRate, User]),
  ],
  controllers: [ShippingController],
  providers: [ShippingService, RajaOngkirProvider],
  exports: [ShippingService, RajaOngkirProvider],
})
export class ShippingModule {}
