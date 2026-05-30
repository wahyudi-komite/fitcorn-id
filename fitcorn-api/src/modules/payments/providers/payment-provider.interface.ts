import { Order } from '../../orders/entities/order.entity';
import { PaymentStatus } from '../entities/payment.entity';

export interface CreatePaymentResult {
  externalId: string; // Token or transaction ID from gateway
  paymentUrl?: string; // Redirect payment page URL
  vaNumber?: string; // Virtual Account number (if VA selected)
  vaBank?: string; // Virtual Account bank name
  status: PaymentStatus;
  rawResponse: any;
}

export interface WebhookResult {
  orderId: string;
  paymentStatus: PaymentStatus;
  method: string;
  amount: number;
  externalId: string;
  paidAt?: Date;
  rawPayload: any;
}

export interface IPaymentProvider {
  createPayment(order: Order, method: string): Promise<CreatePaymentResult>;
  verifyWebhook(payload: any, signature?: string): Promise<WebhookResult>;
  checkStatus(externalId: string): Promise<PaymentStatus>;
}
