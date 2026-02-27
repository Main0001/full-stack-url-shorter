import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import { RedirectMiddleware } from './modules/redirect/redirect.middleware';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Redirect middleware must intercept ALL GET requests — including paths that
  // have no registered controller (short-code URLs). Registering it at the raw
  // Express level ensures it runs before NestJS routing. app.get() is a fast
  // DI container lookup; by the time any request arrives listen() has resolved.
  app.getHttpAdapter().getInstance().use((req: Request, res: Response, next: NextFunction) => {
    app.get(RedirectMiddleware).use(req, res, next);
  });

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: envConfig.frontendUrl,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envConfig.port);
}
bootstrap();
