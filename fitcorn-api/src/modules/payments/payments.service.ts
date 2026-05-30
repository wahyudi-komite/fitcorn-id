import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { MidtransProvider } from './providers/midtrans.provider';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private midtransProvider: MidtransProvider,
    private dataSource: DataSource,
  ) {}

  async createPayment(orderId: string, method: string): Promise<Payment> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: { product: true } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.WAITING_PAYMENT) {
      throw new BadRequestException('Order has already been processed or cancelled');
    }

    // Call payment provider (Midtrans)
    const result = await this.midtransProvider.createPayment(order, method);

    // Create or update payment in database
    let payment = await this.paymentRepository.findOne({
      where: { order: { id: order.id } },
    });

    if (!payment) {
      payment = this.paymentRepository.create({
        order,
        provider: 'midtrans',
        externalId: result.externalId,
        status: result.status,
        method: method,
        amount: order.total,
        paymentUrl: result.paymentUrl || null,
        vaNumber: result.vaNumber || null,
        gatewayResponse: result.rawResponse,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours expiry
      });
    } else {
      payment.externalId = result.externalId;
      payment.paymentUrl = result.paymentUrl || null;
      payment.vaNumber = result.vaNumber || payment.vaNumber || null;
      payment.gatewayResponse = result.rawResponse;
    }

    const savedPayment = await this.paymentRepository.save(payment);

    // Update order status
    order.status = OrderStatus.WAITING_PAYMENT;
    await this.orderRepository.save(order);

    return savedPayment;
  }

  async handleWebhook(payload: any, signature?: string): Promise<void> {
    this.logger.log(`Received payment gateway webhook callback.`);

    // Verify and parse webhook data
    const result = await this.midtransProvider.verifyWebhook(payload, signature);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find matching payment with lock
      const payment = await queryRunner.manager.findOne(Payment, {
        where: { order: { id: result.orderId } },
        relations: { order: { items: { product: { inventory: true } } } },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        throw new NotFoundException(`Payment record for order ${result.orderId} not found`);
      }

      const order = payment.order;
      const prevStatus = payment.status;

      // Update payment status
      payment.status = result.paymentStatus;
      payment.paidAt = result.paidAt || payment.paidAt;
      payment.gatewayResponse = result.rawPayload;
      await queryRunner.manager.save(Payment, payment);

      // Handle order status updates based on payment transition
      if (result.paymentStatus === PaymentStatus.SUCCESS && prevStatus !== PaymentStatus.SUCCESS) {
        this.logger.log(`Payment successful for Order ID: ${order.orderNumber}. Updating status to PAID.`);
        order.status = OrderStatus.PAID;
        
        // Deduct inventory reserved stock (deducted in ACID transaction)
        for (const item of order.items) {
          const product = item.product;
          if (product && product.inventory) {
            product.inventory.reserved = Math.max(0, product.inventory.reserved - item.quantity);
            product.inventory.quantity = Math.max(0, product.inventory.quantity - item.quantity);
            await queryRunner.manager.save(product.inventory);
          }
        }
        await queryRunner.manager.save(Order, order);
      } else if (
        (result.paymentStatus === PaymentStatus.FAILED || result.paymentStatus === PaymentStatus.EXPIRED) &&
        prevStatus === PaymentStatus.PENDING
      ) {
        this.logger.log(`Payment failed/expired for Order ID: ${order.orderNumber}. Releasing stock and cancelling order.`);
        order.status = OrderStatus.CANCELLED;

        // Release inventory reserved stock
        for (const item of order.items) {
          const product = item.product;
          if (product && product.inventory) {
            product.inventory.reserved = Math.max(0, product.inventory.reserved - item.quantity);
            await queryRunner.manager.save(product.inventory);
          }
        }
        await queryRunner.manager.save(Order, order);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Webhook processing failed. Error: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async checkPaymentStatus(orderId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { order: { id: orderId } },
      relations: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === PaymentStatus.PENDING) {
      const freshStatus = await this.midtransProvider.checkStatus(payment.externalId!);
      if (freshStatus !== payment.status) {
        // Trigger status webhook simulation to update database correctly
        await this.handleWebhook({
          simulated: true,
          order_id: orderId,
          transaction_status: freshStatus === PaymentStatus.SUCCESS ? 'settlement' : 'expire',
          gross_amount: payment.amount,
          transaction_id: payment.externalId!,
        });
        return this.paymentRepository.findOne({ where: { id: payment.id }, relations: { order: true } }) as Promise<Payment>;
      }
    }

    return payment;
  }
}
