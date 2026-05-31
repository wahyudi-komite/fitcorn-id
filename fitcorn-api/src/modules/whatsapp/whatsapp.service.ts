import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, AnyMessageContent, delay, WASocket } from '@whiskeysockets/baileys';
import pino from 'pino';
import * as qrcode from 'qrcode-terminal';
// @ts-ignore
import QRCode from 'qrcode';

/**
 * WhatsAppService wraps Baileys socket and provides status, disconnect, and QR code retrieval.
 */
@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private sock: WASocket | null = null;
  private connected = false;
  private qrCodeBase64: string | null = null; // PNG base64 without data prefix

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('wa_sessions');
      const { version } = await fetchLatestBaileysVersion();
      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        version,
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          this.connected = false;
          const shouldReconnect =
            (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          this.logger.warn('WhatsApp connection closed. Reconnecting...', lastDisconnect?.error);
          if (shouldReconnect) {
            delay(3000).then(() => this.onModuleInit());
          }
        } else if (connection === 'open') {
          this.connected = true;
          this.logger.log('✅ WhatsApp connection established');
        }
      });

      // Capture QR and turn it into a base64 PNG for UI consumption
// @ts-ignore
      this.sock.ev.on('qr', async (qr) => {
        try {
          const dataUrl = await QRCode.toDataURL(qr);
          this.qrCodeBase64 = dataUrl.split(',')[1]; // strip prefix
        } catch (e) {
          this.logger.error('Failed to generate QR PNG', e);
        }
        // Also keep printing to terminal for dev convenience
        qrcode.generate(qr, { small: true });
      });

      this.logger.log('✅ Baileys socket initialized (QR may appear in terminal)');
    } catch (err) {
      this.logger.error('Failed to initialize Baileys WhatsApp service', err);
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (!this.sock) {
      this.logger.error('WhatsApp socket not ready – message not sent');
      throw new Error('WhatsApp socket not initialized');
    }
    const jid = `${to.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    const content: AnyMessageContent = { text: message };
    await this.sock.sendMessage(jid, content);
    this.logger.log(`WhatsApp message sent to ${to}`);
  }

  /** Returns true if the socket is currently open */
  isConnected(): boolean {
    return this.connected;
  }

  /** Gracefully close the WhatsApp socket */
  async disconnect(): Promise<void> {
    if (this.sock) {
      await this.sock.logout();
      this.connected = false;
      this.logger.log('✅ WhatsApp connection manually disconnected');
    }
  }

  /** Returns base64 PNG of the latest QR (or null if already connected) */
  /** Returns base64 PNG of the latest QR (or null if already connected) */
  getQrCode(): string | null {
    return this.qrCodeBase64;
  }

  /**
   * Deletes the saved authentication folder to force a new QR login on next init.
   * Returns true if the folder existed and was removed.
   */
  async resetSession(): Promise<boolean> {
    const fs = await import('fs');
    const path = await import('path');
    const sessionPath = path.resolve(process.cwd(), 'wa_sessions');
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      this.logger.log('✅ WhatsApp session cleared');
      return true;
    }
    return false;
  }
}
