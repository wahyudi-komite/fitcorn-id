import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ALL_ENTITIES } from './all-entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'wahyudi',
  password: process.env.DB_PASSWORD || 'Astra123',
  database: process.env.DB_NAME || 'fitcorn_web',
  entities: ALL_ENTITIES,
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
