import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('Redis');
        const client = new Redis({
          host: config.get('REDIS_HOST'),
          port: +config.get('REDIS_PORT'),
        });

        client.on('connect', () => logger.log(' Redis connected'));
        client.on('error', (err) => logger.error(' Redis connection error: ' + err));

        try {
          await client.ping();
          console.log(' Redis ping successful');
        } catch (err) {
          console.error(' Redis ping failed: ' + err);
        }

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
