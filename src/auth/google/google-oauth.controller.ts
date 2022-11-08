import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

import { User } from '../../shared';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { GoogleOauthGuard } from './google-oauth.guard';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/interfaces';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private readonly logger: Logger,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    // With `@UseGuards(GoogleOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-google strategy.
    // The Guard initiates the passport-google flow.
  }

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  //@Redirect(this.configService.get('MONGO_USERNAME'))
  async googleAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Passport automatically creates a `user` object, based on the return value of our
    // GoogleOauthStrategy#validate() method, and assigns it to the Request object as `req.user`
    const user = req.user as User;

    // TODO delete
    this.logger.log({
      log: `${this.googleAuthCallback.name}(): req.user = ${JSON.stringify(
        user,
        null,
        4,
      )}`,
    });

    const { accessToken } = this.jwtAuthService.login(user);
    const cookieOptions: CookieOptions = {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: !this.configService.get('IGNORE_EXPIRATION'),
    };
    this.logger.log('cookie1');
    this.logger.log({ accessToken });
    this.logger.log({ cookieOptions });
    this.logger.log('redirect to ' + this.configService.get('FRONTEND_URL'));
    res.cookie('jwt', accessToken, cookieOptions);
    //res.redirect(HttpStatus.MOVED_PERMANENTLY, 'http://localhost:8080/');
    res.redirect(
      HttpStatus.MOVED_PERMANENTLY,
      this.configService.get('FRONTEND_URL'),
    );

    //res.send('Cookie is set');

    //return { access_token: accessToken };
  }
}
