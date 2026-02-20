import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { RedirectService } from './redirect.service';
import { ClicksService } from '../clicks/clicks.service';

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  constructor(
    private redirectService: RedirectService,
    private clicksService: ClicksService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Only intercept GET requests that don't start with /api
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }

    // Extract short code from path (remove leading /)
    const shortCode = req.path.slice(1);
    if (!shortCode || shortCode.includes('/')) {
      return next();
    }

    try {
      const link = await this.redirectService.findByShortCode(shortCode);

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        '';

      const userAgent = req.headers['user-agent'] || '';
      const referrer = (req.headers['referer'] as string) || null;

      // Fire-and-forget: do not wait for click recording
      this.clicksService
        .recordClick(link.id, ip, userAgent, referrer)
        .catch(() => null);

      return res.redirect(302, link.originalUrl);
    } catch {
      return next();
    }
  }
}
