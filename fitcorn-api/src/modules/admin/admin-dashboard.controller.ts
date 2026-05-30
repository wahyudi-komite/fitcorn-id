import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/dashboard')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminDashboardController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Get('stats')
  async getStats() {
    // 1. Total revenue from completed orders (paid, processing, shipped, delivered)
    const paidOrders = await this.orderRepository.find({
      where: [
        { status: OrderStatus.PAID },
        { status: OrderStatus.PROCESSING },
        { status: OrderStatus.SHIPPED },
        { status: OrderStatus.DELIVERED },
      ],
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);

    // 2. Total orders count
    const totalOrders = await this.orderRepository.count();

    // 3. Total customers count (users with role customer)
    // We can count users who are not admin or just count users since admin is seeded specifically
    const totalCustomers = await this.userRepository.count(); // Approximate or count customer role users

    // 4. Total products count
    const totalProducts = await this.productRepository.count();

    // 5. Recent 5 orders
    const recentOrders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { user: true },
    });

    // 6. Top 5 selling products based on soldCount
    const topProducts = await this.productRepository.find({
      order: { soldCount: 'DESC' },
      take: 5,
      relations: { images: true },
    });

    // 7. Daily sales analytics for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders30Days = await this.orderRepository.find({
      where: {
        createdAt: MoreThanOrEqual(thirtyDaysAgo),
        status: OrderStatus.PAID || OrderStatus.PROCESSING || OrderStatus.SHIPPED || OrderStatus.DELIVERED, // approximate paid
      },
      order: { createdAt: 'ASC' },
    });

    // Group sales by day
    const salesByDayMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      salesByDayMap.set(dayStr, 0);
    }

    recentOrders30Days.forEach((order) => {
      const dayStr = order.createdAt.toISOString().split('T')[0];
      if (salesByDayMap.has(dayStr)) {
        salesByDayMap.set(dayStr, salesByDayMap.get(dayStr)! + Number(order.total));
      }
    });

    const salesAnalytics = Array.from(salesByDayMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts,
      salesAnalytics,
    };
  }
}
