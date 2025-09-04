import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlModule } from './graphql/graphql.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [GqlModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
