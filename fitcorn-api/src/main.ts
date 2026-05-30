import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // Cookie parser for refresh tokens / sessions
  app.use(cookieParser());

  // CORS configuration
  const frontendUrl = configService.get<string>('app.frontendUrl') || 'http://localhost:4200';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global prefix for API
  app.setGlobalPrefix('api');

  // Payload validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in DTO
      transform: true, // auto-transform payloads to DTO instances
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(`Fitcorn API is running on: http://localhost:${port}/api`);
}
bootstrap();
