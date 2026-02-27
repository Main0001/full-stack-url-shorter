import { Injectable, NotFoundException } from '@nestjs/common';
import { LinkRepository } from '../links/repositories/link.repository';
import { ClickRepository } from '../clicks/repositories/click.repository';

@Injectable()
export class StatsService {
  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly clickRepository: ClickRepository,
  ) {}

  async getStatsByStatsCode(
    statsCode: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const link = await this.linkRepository.findByStatsCode(statsCode);

    if (!link) {
      throw new NotFoundException('Stats not found');
    }

    const skip = (page - 1) * limit;

    const [clicks, total] = await Promise.all([
      this.clickRepository.findManyByLink(link.id, skip, limit),
      this.clickRepository.countByLink(link.id),
    ]);

    return {
      link: {
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      },
      data: clicks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSummaryByStatsCode(statsCode: string) {
    const link = await this.linkRepository.findByStatsCode(statsCode);

    if (!link) {
      throw new NotFoundException('Stats not found');
    }

    const [total, byCountry, byCity, byBrowser, byOs, allClickDates] =
      await Promise.all([
        this.clickRepository.countByLink(link.id),
        this.clickRepository.groupByCountry(link.id),
        this.clickRepository.groupByCity(link.id),
        this.clickRepository.groupByBrowser(link.id),
        this.clickRepository.groupByOs(link.id),
        this.clickRepository.findDatesByLink(link.id),
      ]);

    // Group clicks by calendar day (YYYY-MM-DD)
    const dateMap = new Map<string, number>();
    for (const { createdAt } of allClickDates) {
      const day = createdAt.toISOString().split('T')[0];
      dateMap.set(day, (dateMap.get(day) ?? 0) + 1);
    }
    const byDate = Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      link: {
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      },
      total,
      byCountry: byCountry.map((c) => ({
        country: c.country ?? 'Unknown',
        count: c._count._all,
      })),
      byCity: byCity.map((c) => ({
        city: c.city ?? 'Unknown',
        count: c._count._all,
      })),
      byBrowser: byBrowser.map((b) => ({
        browser: b.browser ?? 'Unknown',
        count: b._count._all,
      })),
      byOs: byOs.map((o) => ({
        os: o.os ?? 'Unknown',
        count: o._count._all,
      })),
      byDate,
    };
  }
}
