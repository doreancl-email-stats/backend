import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class MessageDTO {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  })
  user: User;

  @Prop({ required: true, })
  id: string;
  @Prop({ required: true, })
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
