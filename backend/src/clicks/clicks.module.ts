import { Module } from '@nestjs/common';
import { ClicksService } from './clicks.service';
import { GeoModule } from '../geo/geo.module';
import { ClickRepository } from './repositories/click.repository';

@Module({
  imports: [GeoModule],
  providers: [ClicksService, ClickRepository],
  exports: [ClicksService, ClickRepository],
})
export class ClicksModule {}
