import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get(':statsCode')
  getStats(
    @Param('statsCode') statsCode: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.statsService.getStatsByStatsCode(
      statsCode,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':statsCode/summary')
  getSummary(@Param('statsCode') statsCode: string) {
    return this.statsService.getSummaryByStatsCode(statsCode);
  }
}
