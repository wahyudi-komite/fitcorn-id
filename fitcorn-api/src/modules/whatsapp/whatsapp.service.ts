import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, AnyMessageContent, delay, WASocket } from '@whiskeysockets/baileys';
import pino from 'pino';
import * as qrcode from 'qrcode-terminal';

/**
 * WhatsAppService provides a thin wrapper around Baileys to send text messages.
 * It maintains a single socket connection for the lifetime of the NestJS process.
 * The authentication state (QR code, credentials) is stored in the `wa_sessions`
 * directory at the project root, so it persists across restarts.
 */
@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private sock: WASocket | null = null;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Called once when the NestJS module is bootstrapped.
   * It creates the Baileys socket and loads / saves auth credentials.
   */
  async onModuleInit() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('wa_sessions');
      const { version } = await fetchLatestBaileysVersion();
      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }), // suppress noisy logs, we log via Nest
        version,
      });

      // Listen for credential updates and persist them
      this.sock.ev.on('creds.update', saveCreds);

      // Optional: log connection status changes
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          this.logger.warn('WhatsApp connection closed. Reconnecting...', lastDisconnect?.error);
          if (shouldReconnect) {
            // Wait a bit before reconnecting to avoid tight loops
            delay(3000).then(() => this.onModuleInit());
          }
        } else if (connection === 'open') {
          this.logger.log('✅ WhatsApp connection established');
        }
      });

      this.logger.log('✅ Baileys socket initialized (QR may appear in terminal)');
    } catch (err) {
      this.logger.error('Failed to initialize Baileys WhatsApp service', err);
    }
  }

  /**
   * Sends a simple text message to a WhatsApp number.
   * @param to Phone number in international format without '+' (e.g., 628123456789)
   * @param message Text content to send
   */
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
}
