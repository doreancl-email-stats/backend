import { Document } from 'mongoose';

export interface Header extends Document {
  name: string;
  value: string;
}

export interface Payload extends Document {
  partId: string;
  headers: Header[];
}

export interface Message extends Document {
  id: string;
  threadId: string;
  labelIds: string[];
  payload: Payload;
  sizeEstimate: number;
  historyId: string;
  internalDate: number;
}
