import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { StaticConfig } from '../config/app.config';

export const JOB_NAMES = {
  //Get all users with validation date expired and produce a message per user
  EMAIL_RETRIVAL_1_3: 'email.retrival.1_3',
  //X user get GMAIL list and create batches of 100 IDs
  //
  EMAIL_RETRIVAL_2_3: 'email.retrival.2_3',
  //
  EMAIL_RETRIVAL_3_3: 'email.retrival.3_3',
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
