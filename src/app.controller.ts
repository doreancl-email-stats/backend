import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@UseGuards(JwtAuthGuard)
  getHello(): string {
    console.log('getHello');
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    // Passport automatically creates a user object, based on the value we return from the
    // `JwtAuthStrategy#validate()` method, and assigns it to the Request object as `req.user`
    return req.user;
  }

  @Get('testsheets')
  async testSheets() {
    return this.appService.processEmailToSheet();
  }
}
