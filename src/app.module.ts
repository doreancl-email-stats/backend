import { CacheModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleOauthModule } from './auth/google/google-oauth.module';
import { LinksModule } from './links/links.module';
import appConfig from './config/app.config';
import { UsersModule } from './users/users.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    CacheModule.register(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');
        return {
          uri: `mongodb+srv://${username}:${password}@${host}?retryWrites=true&w=majority`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    GoogleOauthModule,
    LinksModule,
    UsersModule,
    GoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
