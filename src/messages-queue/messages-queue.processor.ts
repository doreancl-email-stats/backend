import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { StaticConfig } from '../config/app.config';
import { JOB_NAMES } from './messages-queue.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/interfaces';

@Processor(StaticConfig.MessagesQueueName)
export class MessagesQueueProcessor {
  constructor(private configService: ConfigService<AppConfig>) {}

  private readonly logger = new Logger(MessagesQueueProcessor.name);

  @Process(JOB_NAMES.MESSAGES_LIST)
  handleMessagesList(job: Job) {
    this.logger.debug('Start transcoding...', {
      MY_NODE_NAME: this.configService.get('MY_NODE_NAME'),
      MY_POD_NAMESPACE: this.configService.get('MY_POD_NAMESPACE'),
    });
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }

  @Process(JOB_NAMES.MESSAGES_GET)
  handleMessagesGet(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }

  @Process(JOB_NAMES.EMAIL_RETRIVAL_1_3)
  handleMessagesEMAIL_RETRIVAL_1_3(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}
