import { Logger, Module } from '@nestjs/common';
import { SimpleController } from './simple.controller';
import { SimpleService } from './simple.service';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { MessagesQueueModule } from '../messages-queue/messages-queue.module';
import { GmailModule } from '../google/gmail/gmail.module';

@Module({
  controllers: [SimpleController],
  imports: [UsersModule, MessagesModule, MessagesQueueModule, GmailModule],
  providers: [SimpleService, Logger],
})
export class SimpleModule {}
