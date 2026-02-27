import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { LinkRepository } from './repositories/link.repository';

@Module({
  controllers: [LinksController],
  providers: [LinksService, LinkRepository],
  exports: [LinksService, LinkRepository],
})
export class LinksModule {}
