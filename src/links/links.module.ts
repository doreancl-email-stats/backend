import { CacheModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { Link, LinkSchema } from './schemas/link.schema';
import { Stat, StatSchema } from './schemas/stat.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: Stat.name, schema: StatSchema }]),
    CacheModule.register(),
  ],
  controllers: [LinksController, StatsController],
  providers: [LinksService, StatsService, Logger],
})
export class LinksModule {}
