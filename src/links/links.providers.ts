import { Connection } from 'mongoose';
import { LinkSchema } from './schemas/link.schema';

export const linksProviders = [
  {
    provide: 'LINK_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('L:ink', LinkSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
