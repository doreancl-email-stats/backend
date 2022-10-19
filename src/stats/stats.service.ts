import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GmailService } from '../google/gmail/gmail.service';
import { MessagesService } from '../messages/messages.service';
import { User } from '../users/schemas/user.schema';
import { google } from 'googleapis';

const MAX_CHUNK_SIZE = 10000;

@Injectable()
export class StatsService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly gmailService: GmailService,
    private readonly messagesService: MessagesService,
  ) {}

  async totalUnreadEmails({ from, to }) {
    return await this.messagesService.countBy({
      internalDate: { $gte: from, $lt: to },
    });
  }

  async totalPromotionEmails({ from, to }) {
    return await this.messagesService.countBy({
      labelIds: 'CATEGORY_PROMOTIONS',
      internalDate: { $gte: from, $lt: to },
    });
  }

  async totalReceivedEmails({ from, to }) {
    return await this.messagesService.countBy({
      labelIds: { $nin: ['SENT'] },
      internalDate: { $gte: from, $lt: to },
    });
  }

  async totalSentEmails({ from, to }) {
    return await this.messagesService.countBy({
      labelIds: 'SENT',
      internalDate: { $gte: from, $lt: to },
    });
  }

  formatHistogram(agregationResponse) {
    const histogram = [];
    for (const item of agregationResponse) {
      const date = new Date(
        item._id.year,
        item._id.month - 1,
        item._id.day,
      ).getTime();
      histogram.push([date, item.count]);
    }
    return histogram;
  }

  sortHistogram(histogram) {
    return histogram.sort((a, b) => a[0] - b[0]);
  }

  async receivedEmailsHistogram({ from, to }) {
    const res = await this.getHistogramGeneric({
      filter: {
        labelIds: { $nin: ['SENT'] },
        internalDate: { $gte: from, $lt: to },
      },
    });
    return res;
  }

  async receivedMessagesListBySenderByAddress({ from, to }) {
    return await this.countGroupedByHeaderByAddress({
      filter: {
        internalDate: { $gte: from, $lt: to },
      },
    });
  }

  async receivedMessagesListBySenderByDomain({ from, to }) {
    return await this.countGroupedByHeaderByDomain({
      filter: {
        internalDate: { $gte: from, $lt: to },
      },
    });
  }

  async sentEmailsHistogram({ from, to }) {
    return await this.getHistogramGeneric({
      filter: {
        labelIds: 'SENT',
        internalDate: { $gte: from, $lt: to },
      },
    });
  }

  interactionTemplate = {
    email_address: null,
    messages: null,
    received_messages: null,
    sent_messages: null,
  };

  formatTopInteractions(agregationResponse) {
    const topInteractions = [];
    for (const item of agregationResponse) {
      topInteractions.push({
        ...item,
        email_address: item._id,
      });
    }
    return topInteractions;
  }

  async countGroupedByHeaderByAddress({ filter }) {
    const aggResponse = await this.messagesService.aggregate([
      { $match: filter },
      {
        $addFields: {
          headers_map: {
            $map: {
              input: '$payload.headers',
              as: 'holi',
              in: {
                k: '$$holi.name',
                v: '$$holi.value',
              },
            },
          },
        },
      },
      {
        $addFields: {
          headers: {
            $arrayToObject: '$headers_map',
          },
          isSent: {
            $cond: { if: { $in: ['SENT', '$labelIds'] }, then: 1, else: 0 },
          },
          isReceived: {
            $cond: { if: { $in: ['SENT', '$labelIds'] }, then: 0, else: 1 },
          },
        },
      },
      {
        $addFields: {
          camelFrom: {
            $ifNull: ['$headers.From', '$headers.from', '$headers.FROM', 'Others'],
          },
        },
      },
      {
        $addFields: {
          parseFrom1: { $split: ['$camelFrom', '<'] },
        },
      },
      {
        $addFields: {
          parseFrom2: { $arrayElemAt: ['$parseFrom1', 1] },
        },
      },
      {
        $addFields: {
          parseFrom3: {
            $replaceOne: { input: '$parseFrom2', find: '>', replacement: '' },
          },
        },
      },
      {
        $addFields: {
          address: { $ifNull: ['$parseFrom3', '$camelFrom'] },
        },
      },
      {
        $addFields: {
          parseDomain1: { $split: ['$address', '@'] },
        },
      },
      {
        $addFields: {
          domain: { $arrayElemAt: ['$parseDomain1', 1] },
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          payload: 0,
          headers_map: 0,
          historyId: 0,
          id: 0,
          _id: 0,
          sizeEstimate: 0,
          parseFrom1: 0,
          parseFrom2: 0,
          parseFrom3: 0,
          parseDomain1: 0,
          parseDomain2: 0,
          headers: 0,
          threadId: 0,
        },
      },
      {
        $group: {
          _id: '$address',
          //_id: { address: '$address' },
          //_id: {domain: "$domain"},
          messages: { $sum: 1 },
          sent_messages: { $sum: '$isSent' },
          received_messages: { $sum: '$isReceived' },
        },
      },
      { $sort: { messages: -1 } },
    ]);
    const formatedInteractions = this.formatTopInteractions(aggResponse);
    return formatedInteractions;
  }

  async countGroupedByHeaderByDomain({ filter }) {
    const aggResponse = await this.messagesService.aggregate([
      { $match: filter },
      {
        $addFields: {
          headers_map: {
            $map: {
              input: '$payload.headers',
              as: 'holi',
              in: {
                k: '$$holi.name',
                v: '$$holi.value',
              },
            },
          },
        },
      },
      {
        $addFields: {
          headers: {
            $arrayToObject: '$headers_map',
          },
          isSent: {
            $cond: { if: { $in: ['SENT', '$labelIds'] }, then: 1, else: 0 },
          },
          isReceived: {
            $cond: { if: { $in: ['SENT', '$labelIds'] }, then: 0, else: 1 },
          },
        },
      },
      {
        $addFields: {
          camelFrom: {
            $ifNull: ['$headers.From', '$headers.from', '$headers.FROM', 'Others'],
          },
        },
      },
      {
        $addFields: {
          parseFrom1: { $split: ['$camelFrom', '<'] },
        },
      },
      {
        $addFields: {
          parseFrom2: { $arrayElemAt: ['$parseFrom1', 1] },
        },
      },
      {
        $addFields: {
          parseFrom3: {
            $replaceOne: { input: '$parseFrom2', find: '>', replacement: '' },
          },
        },
      },
      {
        $addFields: {
          address: { $ifNull: ['$parseFrom3', '$camelFrom'] },
        },
      },
      {
        $addFields: {
          parseDomain1: { $split: ['$address', '@'] },
        },
      },
      {
        $addFields: {
          domain: { $arrayElemAt: ['$parseDomain1', 1] },
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          payload: 0,
          headers_map: 0,
          historyId: 0,
          id: 0,
          _id: 0,
          sizeEstimate: 0,
          parseFrom1: 0,
          parseFrom2: 0,
          parseFrom3: 0,
          parseDomain1: 0,
          parseDomain2: 0,
          headers: 0,
          threadId: 0,
        },
      },
      {
        $group: {
          _id: '$domain',
          //_id: { address: '$address' },
          //_id: {domain: "$domain"},
          messages: { $sum: 1 },
          sent_messages: { $sum: '$isSent' },
          received_messages: { $sum: '$isReceived' },
        },
      },
      { $sort: { messages: -1 } },
    ]);
    const formatedInteractions = this.formatTopInteractions(aggResponse);
    return formatedInteractions;
  }

  async getHistogramGeneric({ filter }) {
    const aggResponse = await this.messagesService.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            year: { $year: '$internalDate' },
            month: { $month: '$internalDate' },
            day: { $dayOfMonth: '$internalDate' },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const formatHistogram = this.formatHistogram(aggResponse);
    const sortedHistogram = this.sortHistogram(formatHistogram);

    return sortedHistogram;
  }

  async simpleGmail() {
    // Start User
    // Todo: this will be a custom route, to execute from frontend with the logged user data
    const user: User = await this.usersService.findOneBy({
      user_id: process.env.EXAMPLE_GOOGLE_USER_ID,
    });
    this.logger.debug(user);
    // End User

    // Auth
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    });

    this.logger.debug({ auth });

    const credentials = {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    };

    this.logger.debug({ credentials });

    auth.setCredentials(credentials);
    // End Auth

    // Start gmail service
    // Todo create factory or best implementation on app.module for instance with
    // this already seated
    this.gmailService.gmail = google.gmail({ version: 'v1', auth: auth });

    //End gmail service

    return await this.recursivePagination();

    //return 'super nice!';
  }

  private async recursivePagination(pageToken = null) {
    //Start get email
    const pageChunk = await this.gmailService.list(pageToken);
    const emailsHeaders = [];
    for (const chunk of pageChunk.messages) {
      const emailHeaders = await this.gmailService.getClean(chunk.id);

      emailsHeaders.push(emailHeaders.data);

      if (emailsHeaders.length > MAX_CHUNK_SIZE) {
        //Start send to sheets
        await this.messagesService.createBatch(emailsHeaders);
        emailsHeaders.length = 0; // https://stackoverflow.com/a/1232046/1351242
        //End send to sheets
      }
    }

    //Start send to sheets the rest
    await this.messagesService.createBatch(emailsHeaders);
    emailsHeaders.length = 0; // https://stackoverflow.com/a/1232046/1351242
    //End send to sheets the rest

    //End get email

    //Start recursive
    if (pageChunk.nextPageToken) {
      await this.recursivePagination(pageChunk.nextPageToken);
    }
    //End recursive
    return emailsHeaders;
  }
}
