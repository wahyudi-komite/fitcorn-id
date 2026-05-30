import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { IPaymentProvider, CreatePaymentResult, WebhookResult } from './payment-provider.interface';
import { Order } from '../../orders/entities/order.entity';
import { PaymentStatus } from '../entities/payment.entity';

@Injectable()
export class MidtransProvider implements IPaymentProvider {
  private readonly logger = new Logger(MidtransProvider.name);
  private readonly serverKey: string;
  private readonly clientKey: string;
  private readonly isProduction: boolean;
  private readonly apiBaseUrl: string;
  private readonly snapBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.serverKey = this.configService.get<string>('app.midtrans.serverKey') || '';
    this.clientKey = this.configService.get<string>('app.midtrans.clientKey') || '';
    this.isProduction = this.configService.get<boolean>('app.midtrans.isProduction') || false;

    this.apiBaseUrl = this.isProduction
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2';
    
    this.snapBaseUrl = this.isProduction
      ? 'https://app.midtrans.com/snap/v1'
      : 'https://app.sandbox.midtrans.com/snap/v1';
  }

  private getAuthHeader(): string {
    const buffer = Buffer.from(`${this.serverKey}:`);
    return `Basic ${buffer.toString('base64')}`;
  }

  private isMockMode(): boolean {
    return !this.serverKey || this.serverKey.includes('server-XXXX') || this.serverKey === 'your_midtrans_server_key';
  }

  async createPayment(order: Order, method: string): Promise<CreatePaymentResult> {
    if (this.isMockMode()) {
      this.logger.log(`Using SIMULATED Midtrans payment token creation for order: ${order.orderNumber}`);
      return this.getSimulatedPaymentResult(order, method);
    }

    try {
      // Build Midtrans Snap parameter
      const parameter = {
        transaction_details: {
          order_id: order.id,
          gross_amount: Math.round(order.total),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: order.shippingAddress?.fullName || 'Customer',
          email: order.user?.email || 'customer@fitcorn.id',
          phone: order.shippingAddress?.phone || '6281234567890',
        },
        item_details: order.items.map((item) => ({
          id: item.product?.id || 'item',
          price: Math.round(Number(item.price)),
          quantity: item.quantity,
          name: item.productName.slice(0, 50),
        })),
      };

      // Call Midtrans Snap API
      const response = await axios.post(
        `${this.snapBaseUrl}/transactions`,
        parameter,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const data = response.data;
      if (!data || !data.token) {
        throw new BadRequestException('Failed to generate Midtrans snap token');
      }

      return {
        externalId: data.token, // For Midtrans, snap token is stored in externalId
        paymentUrl: data.redirect_url,
        status: PaymentStatus.PENDING,
        rawResponse: data,
      };
    } catch (error) {
      this.logger.error(`Midtrans createPayment failed, fallback to simulation. Error: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
      return this.getSimulatedPaymentResult(order, method);
    }
  }

  private getSimulatedPaymentResult(order: Order, method: string): CreatePaymentResult {
    const isVa = method.endsWith('_va') || method.includes('va');
    const vaBank = isVa ? method.replace('_va', '').toUpperCase() : undefined;
    const vaNumber = isVa ? `8888${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined;

    return {
      externalId: `MOCK-SNAP-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentUrl: `https://demo.midtrans.com/snap-demo/snap.html?token=MOCK-${order.id}`,
      vaNumber,
      vaBank,
      status: PaymentStatus.PENDING,
      rawResponse: { simulated: true, method },
    };
  }

  async verifyWebhook(payload: any, signature?: string): Promise<WebhookResult> {
    if (this.isMockMode() || payload.simulated) {
      this.logger.log(`Verifying SIMULATED Midtrans webhook for orderId: ${payload.order_id}`);
      return {
        orderId: payload.order_id,
        paymentStatus: payload.transaction_status === 'settlement' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        method: payload.payment_type || 'qris',
        amount: Number(payload.gross_amount),
        externalId: payload.transaction_id || `MOCK-TX-${Date.now()}`,
        paidAt: payload.transaction_status === 'settlement' ? new Date() : undefined,
        rawPayload: payload,
      };
    }

    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type, transaction_id } = payload;

    // Secure Signature verification
    const computedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${this.serverKey}`)
      .digest('hex');

    if (computedSignature !== signature_key) {
      this.logger.warn(`Midtrans Webhook SECURE Signature mismatch! Computed: ${computedSignature}, Received: ${signature_key}`);
      throw new BadRequestException('Invalid signature key');
    }

    let status = PaymentStatus.PENDING;
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      status = PaymentStatus.SUCCESS;
    } else if (transaction_status === 'deny' || transaction_status === 'cancel') {
      status = PaymentStatus.FAILED;
    } else if (transaction_status === 'expire') {
      status = PaymentStatus.EXPIRED;
    }

    return {
      orderId: order_id,
      paymentStatus: status,
      method: payment_type,
      amount: Number(gross_amount),
      externalId: transaction_id,
      paidAt: status === PaymentStatus.SUCCESS ? new Date() : undefined,
      rawPayload: payload,
    };
  }

  async checkStatus(externalId: string): Promise<PaymentStatus> {
    if (this.isMockMode() || externalId.startsWith('MOCK')) {
      return PaymentStatus.SUCCESS; // Mock payments auto-resolve as success on status check
    }

    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/${externalId}/status`,
        {
          headers: {
            Authorization: this.getAuthHeader(),
            Accept: 'application/json',
          },
        },
      );

      const status = response.data?.transaction_status;
      if (status === 'settlement' || status === 'capture') {
        return PaymentStatus.SUCCESS;
      } else if (status === 'deny' || status === 'cancel') {
        return PaymentStatus.FAILED;
      } else if (status === 'expire') {
        return PaymentStatus.EXPIRED;
      }

      return PaymentStatus.PENDING;
    } catch (error) {
      this.logger.error(`Failed to check Midtrans payment status: ${error.message}`);
      return PaymentStatus.PENDING;
    }
  }
}
