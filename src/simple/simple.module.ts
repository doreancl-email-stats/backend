import { Logger, Module } from '@nestjs/common';
import { SimpleController } from './simple.controller';
import { SimpleService } from './simple.service';
import { GmailService } from '../google/gmail/gmail.service';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  controllers: [SimpleController],
  imports: [UsersModule, MessagesModule],
  providers: [SimpleService, Logger, GmailService],
})
export class SimpleModule {}
