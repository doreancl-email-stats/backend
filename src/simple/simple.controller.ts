import { Controller, Get, Query, } from '@nestjs/common';
import { SimpleService } from './simple.service';

@Controller('simple')
export class SimpleController {
  constructor(
    private readonly simpleService: SimpleService,
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
