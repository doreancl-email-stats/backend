import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageDocument, MessageDTO, MessagesCollection, } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Profile } from '../auth/google/interfaces/types';
import { Message } from './interfaces/message.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessagesCollection)
    private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDTODto) {
    const createdCat = new this.messageModel(createMessageDTODto);
    console.log({ createdCat }, { createMessageDTODto });
    return await createdCat.save();
  }

  async createBatch(messages: Message[]) {
    return await this.messageModel
      .insertMany(messages)
      .then((succes) => {
        console.log({ succes });
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  async findOne(id): Promise<MessageDTO> {
    return await this.messageModel.findById(id).exec();
  }

  async findOneBy(filter): Promise<MessageDTO> {
    return await this.messageModel.findOne(filter).exec();
  }

  async countBy(filter) {
    return await this.messageModel.find(filter).count().exec();
  }

  async findAll(): Promise<MessageDTO[]> {
    return await this.messageModel.find().limit(500).exec();
  }

  async aggregate(aggregation): Promise<MessageDTO[]> {
    return await this.messageModel.aggregate(aggregation).exec();
  }

  async update(id, updateMessageDTODto) {
    const message = await this.messageModel.findByIdAndUpdate(
      id,
      updateMessageDTODto,
      {
        new: true,
      },
    );
    if (!message) {
      throw new NotFoundException();
    }
    return message;
  }

  async remove(id) {
    const res: DeleteResult = await this.messageModel
      .deleteOne({
        _id: id,
      })
      .exec();

    return res.deletedCount > 0;
  }

  async findOrCreate(
    id: string,
    provider: string,
    accessToken,
    refreshToken,
    profile: Profile,
  ) {
    let message = await this.findOneBy({ message_id: id });

    if (message) {
      message = await this.update(message._id, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
    if (!message) {
      message = await this.create({
        message_id: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        profile,
      });
    }

    return message;
  }
}
