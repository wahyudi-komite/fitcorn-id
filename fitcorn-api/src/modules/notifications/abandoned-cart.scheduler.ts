import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { Order } from '../orders/entities/order.entity';
import { NotificationsService } from './notifications.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AbandonedCartScheduler {
  private readonly logger = new Logger(AbandonedCartScheduler.name);
  private redis: Redis;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
    // Setup Redis client for deduplication cache
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    });
  }

  /**
   * Run every hour to scan for abandoned carts
   * Check interval is configurable via ABANDONED_CART_CHECK_INTERVAL in env
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkAbandonedCarts() {
    this.logger.log('Starting abandoned cart check...');

    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

    try {
      // Find carts updated between 1 and 24 hours ago that have a user linked
      const activeCarts = await this.cartRepository.find({
        where: {
          updatedAt: Between(twentyFourHoursAgo, oneHourAgo),
        },
        relations: {
          user: true,
          items: {
            product: true,
            variant: true,
          },
        },
      });

      this.logger.log(`Found ${activeCarts.length} carts updated between 1h and 24h ago`);

      let remindersSent = 0;

      for (const cart of activeCarts) {
        // Skip guest carts (no user information to contact)
        if (!cart.user) continue;

        // Skip empty carts
        if (!cart.items || cart.items.length === 0) continue;

        const user = cart.user;
        const cartId = cart.id;
        const lastUpdatedTime = cart.updatedAt.getTime();

        // 1. Check if the user has placed/completed any orders AFTER the cart's last update
        const recentOrders = await this.orderRepository.find({
          where: {
            user: { id: user.id },
            createdAt: MoreThan(cart.updatedAt),
          },
        });

        if (recentOrders.length > 0) {
          this.logger.debug(`User ${user.fullName} (${user.email}) has ordered since cart update. Skipping.`);
          continue;
        }

        // 2. Check in Redis if we've already sent a reminder for this specific cart state
        // Key includes cartId and the timestamp of the last update to ensure if they update their cart again, they can get a new reminder
        const redisKey = `cart:abandoned_reminder_sent:${cartId}:${lastUpdatedTime}`;
        const alreadySent = await this.redis.get(redisKey);

        if (alreadySent) {
          this.logger.debug(`Reminder already sent for cart ${cartId} at state ${lastUpdatedTime}. Skipping.`);
          continue;
        }

        // 3. Compile list of items in cart for personalized messaging
        const itemListStr = cart.items
          .map((item) => {
            const variantStr = item.variant ? ` (${item.variant.name})` : '';
            return `- ${item.product.name}${variantStr} x ${item.quantity}`;
          })
          .join('\n');

        this.logger.log(`Sending abandoned cart reminder to ${user.fullName} (${user.email})`);

        // Send WhatsApp Reminder
        if (user.phone) {
          const waMessage = `Halo kak ${user.fullName}! 👋\n\nKami melihat kamu meninggalkan beberapa item premium popcorn terbaik kami di keranjang belanja:\n\n${itemListStr}\n\nJangan biarkan kelezatannya terlewat! Dapatkan promo spesial diskon 10% dengan kode *FITCORN10* di halaman checkout.\n\nSelesaikan pesananmu sekarang di:\nhttp://localhost:4200/keranjang \n\nSelamat ngemil sehat! 🍿✨`;
          await this.notificationsService.sendWhatsApp(user.phone, waMessage);
        }

        // Send Email Reminder
        if (user.email) {
          const emailSubject = `🍿 Halo ${user.fullName}, item premium popcorn impianmu masih menunggu!`;
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px;">
              <h2 style="color: #FBBF24;">Hi ${user.fullName}! 👋</h2>
              <p>Beberapa item popcorn sehat & lezat di keranjang belanja FITCORN Anda masih setia menunggu untuk dinikmati:</p>
              
              <div style="background-color: #fcfcfc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FBBF24;">
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                  ${cart.items
                    .map((item) => {
                      const variantStr = item.variant ? ` (${item.variant.name})` : '';
                      return `<li style="margin-bottom: 10px; font-weight: bold;">🍿 ${item.product.name}${variantStr} <span style="color: #666;">x ${item.quantity}</span></li>`;
                    })
                    .join('')}
                </ul>
              </div>
              
              <p>Gunakan kode voucher premium <strong>FITCORN10</strong> untuk mendapatkan <strong>potongan diskon 10%</strong> khusus untuk checkout pertama Anda.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:4200/keranjang" style="background-color: #FBBF24; color: #111111; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Ambil Keranjang Belanjaku 🛒</a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center;">FITCORN Premium Popcorn Indonesia - Snacking elevated to art.</p>
            </div>
          `;
          await this.notificationsService.sendEmail(user.email, emailSubject, emailHtml);
        }

        // 4. Mark as sent in Redis with 24 hours (86400 seconds) expiration
        await this.redis.set(redisKey, 'true', 'EX', 86400);
        remindersSent++;
      }

      this.logger.log(`Abandoned cart processing complete. Sent ${remindersSent} reminders.`);
    } catch (error) {
      this.logger.error('Error during checkAbandonedCarts', error.stack);
    }
  }
}
