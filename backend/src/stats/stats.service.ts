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

    const [total, byCountry, byBrowser, byOs, byDate] = await Promise.all([
      this.prisma.click.count({ where: { linkId: link.id } }),

      this.prisma.click.groupBy({
        by: ['country'],
        where: { linkId: link.id },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['browser'],
        where: { linkId: link.id },
        _count: { browser: true },
        orderBy: { _count: { browser: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['os'],
        where: { linkId: link.id },
        _count: { os: true },
        orderBy: { _count: { os: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['createdAt'],
        where: { linkId: link.id },
        _count: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return {
      link: {
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      },
      total,
      byCountry: byCountry.map((c) => ({
        country: c.country ?? 'Unknown',
        count: c._count.country,
      })),
      byBrowser: byBrowser.map((b) => ({
        browser: b.browser ?? 'Unknown',
        count: b._count.browser,
      })),
      byOs: byOs.map((o) => ({
        os: o.os ?? 'Unknown',
        count: o._count.os,
      })),
      byDate: byDate.map((d) => ({
        date: d.createdAt,
        count: d._count.createdAt,
      })),
    };
  }
}
