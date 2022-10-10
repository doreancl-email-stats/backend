import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Logger,
  Query,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Cache } from 'cache-manager';
import { SimpleService } from './simple.service';

@Controller('simple')
export class SimpleController {
  constructor(
    private readonly simpleService: SimpleService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async findAll() {
    return this.simpleService.simpleGmail();
  }

  @Get('one_raw')
  async getOneRaw(@Query() query) {
    console.log(query.id, query.to);

    return this.simpleService.getOneRaw(query.id);
  }
}
