import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './entities/order.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/orders')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminOrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status);
  }

  @Put(':id/tracking')
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
