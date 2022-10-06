import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import * as receivedMessagesListBySender from './static/received_messages_list_by_sender.json';
import * as topInteractionsByAddress from './static/top_interactions_by_address.json';
import * as topInteractionsByDomain from './static/top_interactions_by_domain.json';
import * as receivedEmailsHistogram from './static/received_emails_histogram.json';
import { Response } from 'express';

@Controller('stats')
export class StatsController {
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  @Get('/total_unread_emails/')
  async totalUnreadEmails(@Query() query) {
    return { count: this.randomInteger(100, 500) };
  }

  @Get('/total_promotions_emails/')
  async totalPromotionEmails(@Query() query) {
    return { count: this.randomInteger(100, 500) };
  }

  @Get('/total_received_emails/')
  async totalReceivedEmails(@Query() query) {
    return { count: this.randomInteger(100, 500) };
  }

  @Get('/total_sent_emails/')
  async totalSentEmails(@Query() query) {
    return { count: this.randomInteger(100, 500) };
  }

  @Get('/received_messages_list_by_sender/')
  async receivedMessagesListBySender(@Res() res: Response, @Query() query) {
    res.status(HttpStatus.OK).json(receivedMessagesListBySender);
  }

  @Get('/received_emails_histogram/')
  async receivedEmailsHistogram(@Res() res: Response, @Query() query) {
    const newReceivedEmailsHistogram = [];
    for (const receivedEmail in receivedEmailsHistogram) {
      newReceivedEmailsHistogram.push([
        receivedEmailsHistogram[receivedEmail][0],
        this.randomInteger(30, 500),
      ]);
    }
    res.status(HttpStatus.OK).json(newReceivedEmailsHistogram);
  }

  @Get('/sent_emails_histogram/')
  async sentEmailsHistogram(@Res() res: Response, @Query() query) {
    const newReceivedEmailsHistogram = [];
    for (const receivedEmail in receivedEmailsHistogram) {
      newReceivedEmailsHistogram.push([
        receivedEmailsHistogram[receivedEmail][0],
        this.randomInteger(1, 20),
      ]);
    }
    res.status(HttpStatus.OK).json(newReceivedEmailsHistogram);
  }

  @Get('/top_interactions/')
  async topInteractions(@Res() res: Response, @Query() query) {
    if (query.group_by === 'address') {
      res.status(HttpStatus.OK).json(topInteractionsByAddress);
    } else if (query.group_by === 'domain') {
      res.status(HttpStatus.OK).json(topInteractionsByDomain);
    } else {
      res.status(HttpStatus.OK).json([]);
    }
  }
}
