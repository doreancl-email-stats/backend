import { CacheModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { MessageSchema, MessagesCollection } from './schemas/message.schema';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessagesCollection, schema: MessageSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, Logger],
  exports: [MessagesService],
})
export class MessagesModule {}
