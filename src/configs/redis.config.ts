import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const redisCacheConfig: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    store: await redisStore({
      socket: {
        host: config.get('REDIS_HOST', 'localhost'),
        port: config.get('REDIS_PORT', 6379),
      },
      password: config.get('REDIS_PASSWORD'),
      ttl: 60 * 5 as any,
    }),
  }),
};