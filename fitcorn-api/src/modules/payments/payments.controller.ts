import { Controller, Post, Get, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(
    @Body() body: { orderId: string; method: string },
  ) {
    return this.paymentsService.createPayment(body.orderId, body.method);
  }

  @Public()
  @Post('webhook/midtrans')
  @HttpCode(HttpStatus.OK)
  async handleMidtransWebhook(
    @Body() payload: any,
    @Headers('signature-key') signature?: string,
  ) {
    // If signature header is not supplied, Midtrans payload sometimes contains signature_key inside body
    const sig = signature || payload?.signature_key;
    await this.paymentsService.handleWebhook(payload, sig);
    return { status: 'OK', message: 'Webhook processed successfully' };
  }

  @Get(':orderId/status')
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.checkPaymentStatus(orderId);
  }
}
