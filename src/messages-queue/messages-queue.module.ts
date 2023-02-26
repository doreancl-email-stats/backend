import { Module } from '@nestjs/common';
import { MessagesQueueService } from './messages-queue.service';
import { BullModule } from '@nestjs/bull';
import { MessagesQueueProcessor } from './messages-queue.processor';
import { StaticConfig } from '../config/app.config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: StaticConfig.MessagesQueueName,
    }),
  ],
  providers: [MessagesQueueService, MessagesQueueProcessor],
  exports: [MessagesQueueService],
})
export class MessagesQueueModule {}
