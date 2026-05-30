import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';

import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { BannersModule } from './modules/banners/banners.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ALL_ENTITIES } from './database/all-entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: ALL_ENTITIES,
        synchronize: true, // DEV mode — ganti ke false + migrations untuk production
        // migrations: ['dist/database/migrations/*.js'],
        // migrationsRun: true,
        logging: configService.get<string>('app.nodeEnv') === 'development',
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule,
    ProductsModule,
    CartModule,
    ShippingModule,
    OrdersModule,
    PaymentsModule,
    WishlistModule,
    BannersModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
