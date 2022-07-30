import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../shared';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  login(user) {
    this.logger.log('login', { user });
    const { _id } = user;
    const payload: JwtPayload = {
      sub: _id,
      user: user,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
