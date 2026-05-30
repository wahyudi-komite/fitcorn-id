import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),

  // Midtrans
  midtrans: {
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  },

  // RajaOngkir
  rajaOngkir: {
    apiKey: process.env.RAJAONGKIR_API_KEY,
    baseUrl: process.env.RAJAONGKIR_BASE_URL || 'https://api.rajaongkir.com/starter',
    originCityId: process.env.RAJAONGKIR_ORIGIN_CITY_ID || '501',
  },

  // WhatsApp
  whatsapp: {
    gatewayUrl: process.env.WA_GATEWAY_URL,
    token: process.env.WA_GATEWAY_TOKEN,
    businessNumber: process.env.WA_BUSINESS_NUMBER,
  },

  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
  },
}));
