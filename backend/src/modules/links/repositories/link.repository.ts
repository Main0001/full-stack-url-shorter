import { Injectable } from '@nestjs/common';
import { Link } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

type LinkWithCount = Link & { _count: { clicks: number } };

@Injectable()
export class LinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    originalUrl: string;
    shortCode: string;
    statsCode: string;
    userId: string;
  }): Promise<Link> {
    return this.prisma.link.create({ data });
  }

  findManyByUser(userId: string): Promise<LinkWithCount[]> {
    return this.prisma.link.findMany({
      where: { userId },
      include: { _count: { select: { clicks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Link | null> {
    return this.prisma.link.findFirst({ where: { id, userId } });
  }

  findByIdAndUserWithCount(id: string, userId: string): Promise<LinkWithCount | null> {
    return this.prisma.link.findFirst({
      where: { id, userId },
      include: { _count: { select: { clicks: true } } },
    });
  }

  delete(id: string): Promise<Link> {
    return this.prisma.link.delete({ where: { id } });
  }

  findByStatsCode(statsCode: string): Promise<Link | null> {
    return this.prisma.link.findUnique({ where: { statsCode } });
  }

  findByShortCode(shortCode: string): Promise<Link | null> {
    return this.prisma.link.findUnique({ where: { shortCode } });
  }
}
