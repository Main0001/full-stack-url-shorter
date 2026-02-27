import { Injectable, NotFoundException } from '@nestjs/common';
import { LinkRepository } from '../links/repositories/link.repository';

@Injectable()
export class RedirectService {
  constructor(private readonly linkRepository: LinkRepository) {}

  async findByShortCode(shortCode: string) {
    const link = await this.linkRepository.findByShortCode(shortCode);

    if (!link) {
      throw new NotFoundException('Short link not found');
    }

    return link;
  }
}
