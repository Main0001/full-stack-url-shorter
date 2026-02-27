import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { ClicksModule } from '../clicks/clicks.module';
import { LinksModule } from '../links/links.module';

@Module({
  imports: [ClicksModule, LinksModule],
  providers: [RedirectService],
  exports: [RedirectService],
})
export class RedirectModule {}
