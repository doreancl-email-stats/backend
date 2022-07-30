import { Module } from '@nestjs/common';
import { GmailModule } from './gmail/gmail.module';
import { SheetModule } from './sheet/sheet.module';

@Module({
  imports: [GmailModule, SheetModule],
  providers: [],
  exports: [GmailModule, SheetModule],
})
export class GoogleModule {}
