import { CacheModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './auth/google/google-oauth.module';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { GoogleModule } from './google/google.module';
import { StatsModule } from './stats/stats.module';
import { SimpleModule } from './simple/simple.module';
import { BullModule } from '@nestjs/bull';
import { MessagesQueueModule } from './messages-queue/messages-queue.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'redis-13726.c284.us-east1-2.gce.cloud.redislabs.com',
          port: 13726,
          password: 'XUEQvRbx0aP24VtRw93IiAJ0ZrY3wgyW',
        },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    CacheModule.register(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');
        let uri = `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`;
        uri = `mongodb://${username}:${password}@${host}/?ssl=true&replicaSet=atlas-6gcqfl-shard-0&authSource=admin&retryWrites=true&w=majority`;
        console.log({ uri });
        return {
          uri: uri,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    GoogleOauthModule,
    UsersModule,
    GoogleModule,
    StatsModule,
    SimpleModule,
    MessagesQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
