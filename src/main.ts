// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// import { config } from 'dotenv';
// import { resolve } from 'path';
// config({ path: resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('/api/v1');
  await app.listen(process.env.PORT || 3000);
}

bootstrap().then();
