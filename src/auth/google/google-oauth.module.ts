import { Logger, Module } from '@nestjs/common';

import { UsersModule } from '../../users/users.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  imports: [JwtAuthModule, UsersModule],
  controllers: [GoogleOauthController],
  providers: [Logger, GoogleOauthStrategy],
})
export class GoogleOauthModule {}
