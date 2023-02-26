import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { StaticConfig } from '../config/app.config';

export const JOB_NAMES = {
  MESSAGES_LIST: 'messages.list',
  MESSAGES_GET: 'messages.get',
};

@Injectable()
export class MessagesQueueService {
  constructor(
    @InjectQueue(StaticConfig.MessagesQueueName)
    private readonly messagesQueue: Queue,
  ) {}

  async produce(jobName, data) {
    await this.messagesQueue.add(jobName, data);
  }
}
