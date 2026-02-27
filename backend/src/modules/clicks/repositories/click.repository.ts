import { Injectable } from '@nestjs/common';
import { Click } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    linkId: string;
    ip: string | null;
    browser: string | null;
    os: string | null;
    device: string | null;
    referrer: string | null;
    country: string | null;
    city: string | null;
  }): Promise<Click> {
    return this.prisma.click.create({ data });
  }

  findManyByLink(linkId: string, skip: number, take: number): Promise<Click[]> {
    return this.prisma.click.findMany({
      where: { linkId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countByLink(linkId: string): Promise<number> {
    return this.prisma.click.count({ where: { linkId } });
  }

  groupByCountry(linkId: string) {
    return this.prisma.click.groupBy({
      by: ['country'],
      where: { linkId },
      _count: { _all: true },
      orderBy: { _count: { country: 'desc' } },
    });
  }

  groupByBrowser(linkId: string) {
    return this.prisma.click.groupBy({
      by: ['browser'],
      where: { linkId },
      _count: { _all: true },
      orderBy: { _count: { browser: 'desc' } },
    });
  }

  groupByOs(linkId: string) {
    return this.prisma.click.groupBy({
      by: ['os'],
      where: { linkId },
      _count: { _all: true },
      orderBy: { _count: { os: 'desc' } },
    });
  }

  groupByCity(linkId: string) {
    return this.prisma.click.groupBy({
      by: ['city'],
      where: { linkId },
      _count: { _all: true },
      orderBy: { _count: { city: 'desc' } },
    });
  }

  findDatesByLink(linkId: string): Promise<{ createdAt: Date }[]> {
    return this.prisma.click.findMany({
      where: { linkId },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
