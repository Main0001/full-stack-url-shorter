import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { LinkRepository } from './repositories/link.repository';
import { CreateLinkDto } from './dto/create-link.dto';
import { envConfig } from '../../config/env.config';

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
    const links = await this.linkRepository.findManyByUser(userId);

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
    const link = await this.linkRepository.findByIdAndUserWithCount(id, userId);

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
    const link = await this.linkRepository.findByIdAndUser(id, userId);

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.linkRepository.delete(id);

    return { message: 'Link deleted successfully' };
  }
}
