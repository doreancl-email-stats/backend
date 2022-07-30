import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  provider: string;

  @Prop()
  user_id: string;

  @Prop()
  connection: string;

  @Prop()
  access_token: string;

  @Prop()
  refresh_token: string;
}

export type ProfileDocument = Profile & Document;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
