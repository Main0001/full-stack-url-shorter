import { Module } from '@nestjs/common';
import { ClicksService } from './clicks.service';
import { GeoModule } from '../geo/geo.module';

@Module({
  imports: [GeoModule],
  providers: [ClicksService],
  exports: [ClicksService],
})
export class ClicksModule {}
