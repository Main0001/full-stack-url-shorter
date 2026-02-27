import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeoService } from './geo.service';
import { envConfig } from '../../config/env.config';

@Module({
  imports: [
    HttpModule.register({
      timeout: envConfig.geoTimeout,
    }),
  ],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
