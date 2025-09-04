import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(helmet());

  // const corsOrigin =
  //   process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? true;

  // app.enableCors({
  //   origin: corsOrigin,
  //   credentials: true,
  // });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     transformOptions: { enableImplicitConversion: true },
  //     forbidUnknownValues: false,
  //   }),
  // );

  // app.useGlobalFilters(new AllExceptionsFilter());
  const port = parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port);
  const url = `http://localhost:${port}/graphql`;
  console.log(`🚀 GraphQL ready at ${url}`);
}
bootstrap();
