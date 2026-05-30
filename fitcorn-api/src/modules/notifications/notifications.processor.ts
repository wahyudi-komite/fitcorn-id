import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import * as Bull from 'bull';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);
  private mailTransporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
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
    const gatewayUrl = this.configService.get<string>('app.whatsapp.gatewayUrl') || 'https://api.fonnte.com/send';
    const token = this.configService.get<string>('app.whatsapp.token');

    this.logger.log(`Processing WhatsApp job ${job.id} to: ${to}`);

    if (!token || token === 'your_fonnte_token') {
      this.logger.warn(`WhatsApp notification skipped. WA_GATEWAY_TOKEN is not configured or using placeholder.`);
      return { success: false, reason: 'unconfigured_token' };
    }

    try {
      const response = await axios.post(
        gatewayUrl,
        {
          target: to,
          message: message,
          countryCode: '62', // Default Indonesia
        },
        {
          headers: {
            Authorization: token, // Fonnte uses the token directly in the Authorization header
          },
          timeout: 10000, // 10s timeout
        },
      );

      if (response.data && response.data.status === true) {
        this.logger.log(`WhatsApp job ${job.id} sent successfully to ${to}`);
        return { success: true, response: response.data };
      } else {
        const errReason = response.data?.reason || 'unknown Fonnte error';
        this.logger.error(`Fonnte Gateway failed sending to ${to}: ${errReason}`);
        throw new Error(`Fonnte error: ${errReason}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}: ${error.message}`, error.stack);
      throw error; // Re-throw so Bull can handle retry attempts
    }
  }
}
