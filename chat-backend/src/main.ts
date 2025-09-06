import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { PrismaExceptionFilter } from './common/filters/prisma-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.use(
    helmet({
      // Sandbox/Playground needs relaxed CSP
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
      // Needed for some external assets
      crossOriginEmbedderPolicy: false,
    }),
  );

  const corsOrigin =
    process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? true;

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port);
  const url = `http://localhost:${port}/graphql`;
  console.log(`🚀 GraphQL ready at ${url}`);
}
bootstrap();
