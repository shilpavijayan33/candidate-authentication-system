import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const config = app.get(ConfigService);

  logger.log(`PORT: ${config.get('PORT')}`);
  logger.log(`REDIS_HOST: ${config.get('REDIS_HOST')}`);
  logger.log(`REDIS_PORT: ${config.get('REDIS_PORT')}`);
  logger.log(`DB_HOST: ${config.get('DB_HOST')}`);
  logger.log(`DB_PORT: ${config.get('DB_PORT')}`);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  try {
    await app.listen(config.get('PORT') || 3000);
    logger.log(` Application started successfully`);
  } catch (err) {
    logger.error(' Application failed to start: ' + err);
    process.exit(1);
  }
}

bootstrap();
