import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { ClicksModule } from '../clicks/clicks.module';

@Module({
  imports: [ClicksModule],
  providers: [RedirectService],
  exports: [RedirectService],
})
export class RedirectModule {}
