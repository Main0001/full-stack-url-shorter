import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import { RedirectService } from './redirect/redirect.service';
import { ClicksService } from './clicks/clicks.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Register short URL redirect BEFORE app.init() so it runs before NestJS routes.
  // NestJS forRoutes() applies the global prefix, so raw Express middleware is used here
  // to intercept root-level /:shortCode requests.
  let redirectService: RedirectService;
  let clicksService: ClicksService;

  app.getHttpAdapter().getInstance().use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || !redirectService) {
      return next();
    }

    const shortCode = req.path.slice(1);
    if (!shortCode || shortCode.includes('/')) {
      return next();
    }

    try {
      const link = await redirectService.findByShortCode(shortCode);

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        '';
      const userAgent = req.headers['user-agent'] || '';
      const referrer = (req.headers['referer'] as string) || null;

      clicksService.recordClick(link.id, ip, userAgent, referrer).catch(() => null);

      return res.redirect(302, link.originalUrl);
    } catch {
      return next();
    }
  });

  // Initialize NestJS DI and routes (AFTER Express middleware above)
  await app.init();

  // Populate services after init (safe: server not listening yet)
  redirectService = app.get(RedirectService);
  clicksService = app.get(ClicksService);

  await app.listen(envConfig.port);
}
bootstrap();
