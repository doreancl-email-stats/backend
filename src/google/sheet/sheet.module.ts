import { Logger, Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SheetsService, Logger],
  exports: [SheetsService],
})
export class SheetModule {}
