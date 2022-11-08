import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfig } from '../../config/interfaces';
import { JwtPayload } from '../../shared';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: Logger,
    private configService: ConfigService<AppConfig>,
  ) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Users can send us the JWT token either by a bearer token in an authorization header...
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // ... or in a cookie named "jwt"
        (request: Request) => {
          this.logger.debug(
            `${JwtAuthStrategy.name}#${this.validate.name}():`,
            'cookie',
            request.cookies,
          );
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration:
        configService.get<boolean>('IGNORE_EXPIRATION') || false,
      secretOrKey: configService.get<string>('auth.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    // For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON.
    // It then invokes our validate() method passing the decoded JSON as its single parameter.
    // Based on the way JWT signing works, we're guaranteed that we're receiving a valid token
    // that we have previously signed and issued to a valid user.
    // `payload` is that what JwtAuthService#login() has created and what thereafter
    // GithubOauthController#githubAuthCallback() has saved as cookie named "jwt".

    // TODO delete
    this.logger.debug(
      `${JwtAuthStrategy.name}#${
        this.validate.name
      }(): payload = ${JSON.stringify(payload, null, 4)}`,
    );

    // Passport assigns the value we return from this method to the Request object as `req.user`.
    // AppController#getProfile() uses this as an example.
    const { user } = payload;
    return { user };
  }
}
