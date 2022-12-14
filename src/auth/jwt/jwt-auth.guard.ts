import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: Logger) {
    super();
  }

  handleRequest(err, user, info) {
    this.logger.debug('handleRequest 1', { err, user, info });
    this.logger.debug('handleRequest 2');
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
