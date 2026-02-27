import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectMiddleware } from './redirect.middleware';
import { ClicksModule } from '../clicks/clicks.module';
import { LinksModule } from '../links/links.module';

@Module({
  imports: [ClicksModule, LinksModule],
  providers: [RedirectService, RedirectMiddleware],
  exports: [RedirectService, RedirectMiddleware],
})
export class RedirectModule {}
