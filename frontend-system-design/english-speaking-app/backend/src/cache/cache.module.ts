import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const redisUrl = configService.get<string>('REDIS_URL');

                // Use Redis if available, otherwise use in-memory cache
                if (redisUrl) {
                    // Dynamic import for Redis
                    const { redisStore } = await import('cache-manager-ioredis-yet');
                    return {
                        store: redisStore,
                        host: new URL(redisUrl).hostname,
                        port: parseInt(new URL(redisUrl).port) || 6379,
                        ttl: 60 * 1000, // 60 seconds default TTL
                    };
                }

                // In-memory cache for development
                return {
                    ttl: 60 * 1000,
                    max: 100, // Maximum number of items in cache
                };
            },
            isGlobal: true,
        }),
    ],
    exports: [CacheModule],
})
export class AppCacheModule { }
