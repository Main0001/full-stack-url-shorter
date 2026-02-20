import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class ClicksService {
  constructor(
    private prisma: PrismaService,
    private geoService: GeoService,
  ) {}

  async recordClick(
    linkId: string,
    ip: string,
    userAgent: string,
    referrer: string | null,
  ) {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name ?? null;
    const os = parser.getOS().name ?? null;
    const device = parser.getDevice().type ?? 'desktop';

    const geo = await this.geoService.getGeoByIp(ip);

    await this.prisma.click.create({
      data: {
        linkId,
        ip,
        browser,
        os,
        device,
        referrer,
        country: geo.country,
        city: geo.city,
      },
    });
  }

  async findByLink(linkId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [clicks, total] = await Promise.all([
      this.prisma.click.findMany({
        where: { linkId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.click.count({ where: { linkId } }),
    ]);

    return {
      data: clicks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSummary(linkId: string) {
    const [total, byCountry, byBrowser, byOs] = await Promise.all([
      this.prisma.click.count({ where: { linkId } }),

      this.prisma.click.groupBy({
        by: ['country'],
        where: { linkId },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['browser'],
        where: { linkId },
        _count: { browser: true },
        orderBy: { _count: { browser: 'desc' } },
      }),

      this.prisma.click.groupBy({
        by: ['os'],
        where: { linkId },
        _count: { os: true },
        orderBy: { _count: { os: 'desc' } },
      }),
    ]);

    return {
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
    };
  }
}
