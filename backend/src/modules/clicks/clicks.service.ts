import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { ClickRepository } from './repositories/click.repository';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class ClicksService {
  constructor(
    private readonly clickRepository: ClickRepository,
    private readonly geoService: GeoService,
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

    await this.clickRepository.create({
      linkId,
      ip,
      browser,
      os,
      device,
      referrer,
      country: geo.country,
      city: geo.city,
    });
  }

  async findByLink(linkId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [clicks, total] = await Promise.all([
      this.clickRepository.findManyByLink(linkId, skip, limit),
      this.clickRepository.countByLink(linkId),
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
      this.clickRepository.countByLink(linkId),
      this.clickRepository.groupByCountry(linkId),
      this.clickRepository.groupByBrowser(linkId),
      this.clickRepository.groupByOs(linkId),
    ]);

    return {
      total,
      byCountry: byCountry.map((c) => ({
        country: c.country ?? 'Unknown',
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
    };
  }
}
