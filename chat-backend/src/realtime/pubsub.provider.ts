import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const PUB_SUB = Symbol('PUB_SUB');

export const pubSubProvider: Provider = {
  provide: PUB_SUB,
  useFactory: () => {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    const base = { maxRetriesPerRequest: null, enableReadyCheck: false };
    const create = () =>
      new Redis(url, {
        ...base,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        lazyConnect: false,
      });

    const publisher = create();
    const subscriber = create();

    return new RedisPubSub({ publisher, subscriber });
  },
};
