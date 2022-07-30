import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Profile } from './interfaces/types';
import { UsersService } from '../../users/users.service';

config();

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACKURL,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.metadata',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
      authorizationURL:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done,
  ) {
    try {
      const { id } = profile;
      const user = await this.usersService.findOrCreate(
        id,
        'google',
        accessToken,
        _refreshToken,
        profile,
      );
      done(null, user);
    } catch (e) {
      this.logger.debug([54, e]);
      throw new UnauthorizedException();
    }
  }
}
