import { Controller, Get, Post, Put, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // ==================== CUSTOMER ENDPOINTS ====================

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

  // ==================== ADMIN ENDPOINTS ====================

  @Get('admin/all')
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Put('admin/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }

  @Put('admin/:id/tracking')
  async inputTrackingNumber(
    @Param('id') orderId: string,
    @Body() body: { courierName: string; courierService: string; trackingNumber: string },
  ) {
    return this.ordersService.inputTrackingNumber(
      orderId,
      body.courierName,
      body.courierService,
      body.trackingNumber,
    );
  }
}
