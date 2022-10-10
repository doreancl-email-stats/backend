import { Logger, Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [GmailService, Logger],
  exports: [GmailService],
})
export class GmailModule {}
