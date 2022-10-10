import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transform } from 'class-transformer';

@Schema({ timestamps: true })
export class MessageDTO {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  id: string;
  @Prop()
  threadId: string;
  @Prop()
  labelIds: string[];
  @Prop({ type: Object })
  payload: {
    partId: string;
    headers: [{ name: string; value: string }];
  };
  @Prop()
  sizeEstimate: number;
  @Prop()
  historyId: string;
  @Prop()
  internalDate: Date;
}

export const MessagesCollection = 'messages';
export type MessageDocument = MessageDTO & Document;
export const MessageSchema = SchemaFactory.createForClass(MessageDTO);
