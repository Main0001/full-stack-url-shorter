import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GetStatsQueryDto } from './dto/get-stats-query.dto';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get(':statsCode')
  getStats(
    @Param('statsCode') statsCode: string,
    @Query() query: GetStatsQueryDto,
  ) {
    return this.statsService.getStatsByStatsCode(statsCode, query.page, query.limit);
  }

  @Get(':statsCode/summary')
  getSummary(@Param('statsCode') statsCode: string) {
    return this.statsService.getSummaryByStatsCode(statsCode);
  }
}
