import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('links')
@UseGuards(AccessTokenGuard)
export class LinksController {
  constructor(private linksService: LinksService) {}

  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateLinkDto,
  ) {
    return this.linksService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.linksService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.linksService.findOne(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.linksService.remove(id, userId);
  }
}
