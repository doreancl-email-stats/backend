import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    cors: true,
    bufferLogs: true,
  });

  app.use(cookieParser());
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
  console.log(
    `Application is running on: ${await app.getUrl()} in ${configService.get('NODE_ENV')} environment`,
  );
}

bootstrap();
