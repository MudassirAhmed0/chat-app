import { Query, Resolver } from '@nestjs/graphql';
import { Health } from './health.model';

@Resolver(() => Health)
export class HealthResolver {
  @Query(() => Health, { name: 'health' })
  health(): Health {
    return {
      ok: true,
      uptime: Math.round(process.uptime()),
      env: process.env.NODE_ENV ?? 'development',
    };
  }
}
