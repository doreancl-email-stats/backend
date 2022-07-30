import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaTypes } from 'mongoose';
import { Transform } from 'class-transformer';

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  email_verified: boolean;

  @Prop()
  is_active: boolean;

  @Prop()
  last_login: string;

  //Profile
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

  @Prop()
  profile: SchemaTypes.Types.Mixed;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
