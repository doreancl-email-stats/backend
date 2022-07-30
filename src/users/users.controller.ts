import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createLinkDto) {
    return await this.usersService.create(createLinkDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug(id);
    const link = await this.usersService.findOne(id);
    if (!link) {
      throw new NotFoundException();
    }
    return link;
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateLinkDto) {
    return this.usersService.update(+id, updateLinkDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLinkDto) {
    return this.usersService.update(id, updateLinkDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isRemoved = await this.usersService.remove(id);

    if (isRemoved !== true) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.del(id);

    return;
  }
}
