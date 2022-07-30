import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;

  //profile
  provider: string;
  user_id: string;
  connection: string;
  access_token: string;
  refresh_token: string;
}
