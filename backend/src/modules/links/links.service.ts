import { Injectable, NotFoundException } from '@nestjs/common';
import { Link } from '@prisma/client';
import { nanoid } from 'nanoid';
import { LinkRepository } from './repositories/link.repository';
import { CreateLinkDto } from './dto/create-link.dto';
import { envConfig } from '../../config/env.config';

type LinkWithCount = Link & { _count: { clicks: number } };

function toLinkResponse(link: Link) {
  return {
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: `${envConfig.backendUrl}/${link.shortCode}`,
    statsUrl: `${envConfig.frontendUrl}/stats/${link.statsCode}`,
    shortCode: link.shortCode,
    statsCode: link.statsCode,
    createdAt: link.createdAt,
  };
}

function toLinkWithCountResponse(link: LinkWithCount) {
  return {
    ...toLinkResponse(link),
    clicks: link._count.clicks,
  };
}

@Injectable()
export class LinksService {
  constructor(private readonly linkRepository: LinkRepository) {}

  async create(userId: string, dto: CreateLinkDto) {
    const shortCode = nanoid(8);
    const statsCode = nanoid(12);

    const link = await this.linkRepository.create({
      originalUrl: dto.originalUrl,
      shortCode,
      statsCode,
      userId,
    });

    return toLinkResponse(link);
  }

  async findAllByUser(userId: string) {
    const links = await this.linkRepository.findManyByUser(userId);
    return links.map((link) => toLinkWithCountResponse(link));
  }

  async findOne(id: string, userId: string) {
    const link = await this.linkRepository.findByIdAndUserWithCount(id, userId);

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return toLinkWithCountResponse(link);
  }

  async remove(id: string, userId: string) {
    const link = await this.linkRepository.findByIdAndUser(id, userId);

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.linkRepository.delete(id);

    return { message: 'Link deleted successfully' };
  }
}
