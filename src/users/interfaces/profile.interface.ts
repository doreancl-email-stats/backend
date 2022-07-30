import { Document } from 'mongoose';

export interface Profile extends Document {
  provider: string;
  user_id: string;
  connection: string;
  access_token: string;
  refresh_token: string;
}
