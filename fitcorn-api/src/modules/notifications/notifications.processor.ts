import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import * as Bull from 'bull';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);
  private mailTransporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsAppService,
  ) {
    // Setup SMTP Transporter
    const host = this.configService.get<string>('app.smtp.host') || 'smtp.gmail.com';
    const port = this.configService.get<number>('app.smtp.port') || 587;
    const user = this.configService.get<string>('app.smtp.user');
    const pass = this.configService.get<string>('app.smtp.pass');

    this.logger.log(`Initializing Nodemailer with ${host}:${port}`);

    this.mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  @Process('email')
  async handleEmail(job: Bull.Job<{ to: string; subject: string; html: string }>) {
    const { to, subject, html } = job.data;
    const from = this.configService.get<string>('app.smtp.from') || 'Fitcorn <noreply@fitcorn.id>';

    this.logger.log(`Processing email job ${job.id} to: ${to}`);

    try {
      const info = await this.mailTransporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email job ${job.id} sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      throw error; // Re-throw so Bull can handle retry attempts
    }
  }

  @Process('whatsapp')
  async handleWhatsApp(job: Bull.Job<{ to: string; message: string }>) {
    const { to, message } = job.data;
    this.logger.log(`Processing WhatsApp job ${job.id} to: ${to}`);
    try {
      // Use the injected WhatsAppService to send message via Baileys
      await this.whatsappService.sendMessage(to, message);
      this.logger.log(`WhatsApp job ${job.id} sent successfully to ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}: ${error.message}`, error.stack);
      throw error; // Let Bull handle retries
    }
  }
}
