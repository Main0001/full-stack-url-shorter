import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { LinksModule } from '../links/links.module';
import { ClicksModule } from '../clicks/clicks.module';

@Module({
  imports: [LinksModule, ClicksModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
