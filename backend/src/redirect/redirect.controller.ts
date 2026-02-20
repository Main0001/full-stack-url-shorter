import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RedirectService } from './redirect.service';
import { ClicksService } from '../clicks/clicks.service';

@Controller()
export class RedirectController {
  constructor(
    private redirectService: RedirectService,
    private clicksService: ClicksService,
  ) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const link = await this.redirectService.findByShortCode(shortCode);

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';

    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || null;

    // Fire-and-forget: do not wait for click recording
    this.clicksService
      .recordClick(link.id, ip, userAgent, referrer)
      .catch(() => null);

    return res.redirect(302, link.originalUrl);
  }
}
