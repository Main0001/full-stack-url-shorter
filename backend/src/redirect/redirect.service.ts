import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedirectService {
  constructor(private prisma: PrismaService) {}

  async findByShortCode(shortCode: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    return link;
  }
}
