import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStatsByStatsCode(
    statsCode: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const link = await this.prisma.link.findUnique({
      where: { statsCode },
    });

    if (!link) {
      throw new NotFoundException('Stats not found');
    }

    const skip = (page - 1) * limit;

    const [clicks, total] = await Promise.all([
      this.prisma.click.findMany({
        where: { linkId: link.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.click.count({ where: { linkId: link.id } }),
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
    const link = await this.prisma.link.findUnique({
      where: { statsCode },
    });

    if (!link) {
      throw new NotFoundException('Stats not found');
    }

    const [total, byCountry, byCity, byBrowser, byOs, allClickDates] = await Promise.all([
      this.prisma.click.count({ where: { linkId: link.id } }),

      this.prisma.click.groupBy({
        by: ['country'],
        where: { linkId: link.id },
        _count: { _all: true },
        orderBy: { _count: { country: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['city'],
        where: { linkId: link.id },
        _count: { _all: true },
        orderBy: { _count: { city: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['browser'],
        where: { linkId: link.id },
        _count: { _all: true },
        orderBy: { _count: { browser: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['os'],
        where: { linkId: link.id },
        _count: { _all: true },
        orderBy: { _count: { os: 'desc' } },
      }),

      // Fetch raw dates to group by day in memory (groupBy on DateTime groups by exact timestamp)
      this.prisma.click.findMany({
        where: { linkId: link.id },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Group clicks by calendar day (YYYY-MM-DD)
    const dateMap = new Map<string, number>();
    for (const { createdAt } of allClickDates) {
      const day = createdAt.toISOString().split('T')[0];
      dateMap.set(day, (dateMap.get(day) ?? 0) + 1);
    }
    const byDate = Array.from(dateMap.entries()).map(([date, count]) => ({ date, count }));

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
