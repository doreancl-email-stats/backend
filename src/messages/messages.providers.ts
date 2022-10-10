import { Connection } from 'mongoose';
import { MessageSchema } from './schemas/message.schema';

export const messagesProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('L:ink', MessageSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
