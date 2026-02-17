import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { envConfig } from '../config/env.config';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLinkDto) {
    const shortCode = nanoid(8);
    const statsCode = nanoid(12);

    const link = await this.prisma.link.create({
      data: {
        originalUrl: dto.originalUrl,
        shortCode,
        statsCode,
        userId,
      },
    });

    return {
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: `${envConfig.backendUrl}/${shortCode}`,
      statsUrl: `${envConfig.frontendUrl}/stats/${statsCode}`,
      shortCode: link.shortCode,
      statsCode: link.statsCode,
      createdAt: link.createdAt,
    };
  }

  async findAllByUser(userId: string) {
    const links = await this.prisma.link.findMany({
      where: { userId },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links.map((link) => ({
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: `${envConfig.backendUrl}/${link.shortCode}`,
      statsUrl: `${envConfig.frontendUrl}/stats/${link.statsCode}`,
      shortCode: link.shortCode,
      statsCode: link.statsCode,
      clicks: link._count.clicks,
      createdAt: link.createdAt,
    }));
  }

  async findOne(id: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return {
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: `${envConfig.backendUrl}/${link.shortCode}`,
      statsUrl: `${envConfig.frontendUrl}/stats/${link.statsCode}`,
      shortCode: link.shortCode,
      statsCode: link.statsCode,
      clicks: link._count.clicks,
      createdAt: link.createdAt,
    };
  }

  async remove(id: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.prisma.link.delete({
      where: { id },
    });

    return { message: 'Link deleted successfully' };
  }
}
