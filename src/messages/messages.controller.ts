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
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MessagesService } from './messages.service';

@Controller('messages')
//@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @Get()
  async findAll() {
    return await this.messagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug(id);
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException();
    }
    return message;
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isRemoved = await this.messagesService.remove(id);

    if (isRemoved !== true) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.del(id);

    return;
  }
}
