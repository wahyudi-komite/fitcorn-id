import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser() user: User,
    @Body() body: {
      addressId: string;
      courierName: string;
      courierService: string;
      shippingCost: number;
      couponCode?: string;
      notes?: string;
    },
  ) {
    return this.ordersService.createOrder(user, body);
  }

  @Get()
  async getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user);
  }

  @Get(':id')
  async getOrderDetail(@CurrentUser() user: User, @Param('id') orderId: string) {
    return this.ordersService.getOrderDetail(orderId, user);
  }

  @Public()
  @Get(':id/tracking')
  async getOrderTracking(@Param('id') orderId: string) {
    return this.ordersService.getOrderTracking(orderId);
  }
}
