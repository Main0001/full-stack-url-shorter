import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectMiddleware } from './redirect.middleware';
import { ClicksModule } from '../clicks/clicks.module';

@Module({
  imports: [ClicksModule],
  providers: [RedirectService, RedirectMiddleware],
  exports: [RedirectService, RedirectMiddleware],
})
export class RedirectModule {}
