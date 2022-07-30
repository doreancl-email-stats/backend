import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async findAll() {
    return await this.statsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.statsService.findOne(id);
  }
}
