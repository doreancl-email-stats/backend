import { Logger, Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { UsersModule } from '../users/users.module';
import { GmailModule } from '../google/gmail/gmail.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  controllers: [StatsController],
  imports: [UsersModule, GmailModule, MessagesModule],
  providers: [StatsService, Logger],
})
export class StatsModule {}
