import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Stat, StatDocument } from './schemas/stat.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stat.name) private statModel: Model<StatDocument>,
    private readonly logger: Logger,
  ) {}

  async create(createStatDto) {
    const createdCat = new this.statModel(createStatDto);
    return await createdCat.save();
  }

  async findOne(id): Promise<Stat> {
    return await this.statModel.findById(id).exec();
  }

  async findAll(): Promise<Stat[]> {
    return await this.statModel.find().exec();
  }

  async addStat(id: string) {
    const now = new Date();
    const reportDate =
      now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();

    try {
      await this.statModel.findOneAndUpdate(
        { link: id, time: reportDate },
        {
          link: id,
          time: reportDate,
          $inc: { count: 1 },
        },
        { upsert: true, new: true, useFindAndModify: false },
      );
    } catch (e) {
      this.logger.debug(e);
    }
    return;
  }
}
