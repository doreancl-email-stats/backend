import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SimpleService } from './simple.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/interfaces';

@Controller('simple')
@UseGuards(JwtAuthGuard)
export class SimpleController {
  constructor(
    private readonly simpleService: SimpleService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get()
  async findAll() {
    return this.simpleService.simpleGmail();
  }

  @Get('one_raw')
  async getOneRaw(@Query() query) {
    console.log(query.id, query.to);

    return this.simpleService.getOneRaw(query.id);
  }

  @Get('simplecookie')
  async simpleCookie1(
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(
      { query },
      {
        domain: this.configService.get('COOKIE_DOMAIN'),
        path: '/',
        sameSite: 'lax',
      },
    );

    res.cookie('jwt6', 'aaa', {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: !this.configService.get('IGNORE_EXPIRATION'),
    });

    res.send({
      message: 'Cookie is set',
    });
  }
}
