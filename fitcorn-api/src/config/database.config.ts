import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  name: process.env.DB_NAME || 'fitcorn_web',
  username: process.env.DB_USERNAME || 'wahyudi',
  password: process.env.DB_PASSWORD || 'Astra123',
}));
