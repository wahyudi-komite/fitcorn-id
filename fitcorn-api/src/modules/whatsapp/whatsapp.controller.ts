import { Controller, Get, Post } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

/**
 * Exposes admin‑level endpoints to interact with the Baileys WhatsApp socket.
 */
@Controller('admin/whatsapp')
export class AdminWhatsAppController {
  constructor(private readonly waService: WhatsAppService) {}

  @Get('status')
  getStatus() {
    return { connected: this.waService.isConnected() };
  }

  @Post('disconnect')
  async disconnect() {
    await this.waService.disconnect();
    return { success: true };
  }

  @Get('qr')
  getQr() {
    const qr = this.waService.getQrCode();
    return { qr };
  }
}
