import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  Res,
} from '@nestjs/common';
import * as receivedMessagesListBySender from './static/received_messages_list_by_sender.json';
import * as topInteractionsByAddress from './static/top_interactions_by_address.json';
import * as topInteractionsByDomain from './static/top_interactions_by_domain.json';
import * as receivedEmailsHistogram from './static/received_emails_histogram.json';
import { Response } from 'express';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly logger: Logger,
  ) {
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  @Get('/total_unread_emails/')
  async totalUnreadEmails(@Query() query) {
    const count = await this.statsService.totalUnreadEmails({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    return { count };
  }

  @Get('/total_promotions_emails/')
  async totalPromotionEmails(@Query() query) {
    const count = await this.statsService.totalPromotionEmails({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    return { count };
  }

  @Get('/total_received_emails/')
  async totalReceivedEmails(@Query() query) {
    const count = await this.statsService.totalReceivedEmails({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    return { count };
  }

  @Get('/total_sent_emails/')
  async totalSentEmails(@Query() query) {
    const count = await this.statsService.totalSentEmails({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    return { count };
  }

  @Get('/received_messages_list_by_sender/')
  async receivedMessagesListBySender(@Res() res: Response, @Query() query) {
    const resp = await this.statsService.receivedMessagesListBySender({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    res.status(HttpStatus.OK).json(resp);
  }

  @Get('/received_emails_histogram/')
  async receivedEmailsHistogram(@Res() res: Response, @Query() query) {
    const resp = await this.statsService.receivedEmailsHistogram({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    res.status(HttpStatus.OK).json(resp);
  }

  @Get('/sent_emails_histogram/')
  async sentEmailsHistogram(@Res() res: Response, @Query() query) {
    const resp = await this.statsService.sentEmailsHistogram({
      from: new Date(parseInt(query.from)),
      to: new Date(parseInt(query.to)),
    });
    res.status(HttpStatus.OK).json(resp);
  }

  @Get('/top_interactions/')
  async topInteractions(@Res() res: Response, @Query() query) {
    if (query.group_by === 'address') {
      const resp = await this.statsService.receivedMessagesListBySender({
        from: new Date(parseInt(query.from)),
        to: new Date(parseInt(query.to)),
      });
      res.status(HttpStatus.OK).json(resp);
    } else if (query.group_by === 'domain') {
      res.status(HttpStatus.OK).json(topInteractionsByDomain);
    } else {
      res.status(HttpStatus.OK).json([]);
    }
  }
}
