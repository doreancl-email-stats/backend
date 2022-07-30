import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Response,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinksService } from './links.service';
import { StatsService } from './stats.service';
import { Cache } from 'cache-manager';
import { Link } from './schemas/link.schema';

@Controller('links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly statsService: StatsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    return await this.linksService.create(createLinkDto);
  }

  @Get()
  async findAll() {
    return await this.linksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const link = await this.linksService.findOne(id);
    if (!link) {
      throw new NotFoundException();
    }
    return link;
  }

  @Get('/redirect/:link')
  async redirect(@Param('link') link: string, @Response() res) {
    let redirectLink: Link = await this.cacheManager.get(link);
    if (!redirectLink) {
      redirectLink = await this.linksService.findOneBy({ link: link });

      if (!redirectLink) {
        throw new NotFoundException();
      }
      await this.cacheManager.set(link, redirectLink, { ttl: 900 });
    }
    res.redirect(HttpStatus.MOVED_PERMANENTLY, redirectLink.long_url);
    this.statsService.addStat(redirectLink._id).then((r) => null);
    return redirectLink;
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isRemoved = await this.linksService.remove(id);

    if (isRemoved !== true) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.del(id);

    return;
  }
}
