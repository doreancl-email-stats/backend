import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

const format = 'metadata';
const REQUESTED_HEADERS = ['Delivered-To', 'Subject', 'From', 'To', 'Date'];

@Injectable()
export class GmailService {
  constructor(private readonly logger: Logger) {}

  set gmail(value: any) {
    this._gmail = value;
  }

  private _gmail: any;

  private readonly _maxResults =
    process.env.GOOGLE_MESSAGES_LIST_MAXRESULTS || 500; // https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list?hl=en_US#query-parameters

  public list = async (pageToken = null, maxResult = null) => {
    try {
      const res1 = await this._gmail.users.messages.list({
        userId: 'me',
        pageToken: pageToken,
        maxResults: maxResult || this._maxResults,
      });
      return res1.data;
    } catch (e) {
      this.logger.error({ e });
      return e;
    }
  };

  /***
   * Deprecated
   * @param id
   */
  public get = async (id): Promise<any> => {
    const message = await this._gmail.users.messages.get({
      userId: 'me',
      // id: res1.data.messages[0].id,
      id,
      format: format,
      metadataHeaders: REQUESTED_HEADERS,
    });

    return this._normalizeMessageHeaders(message.data.payload.headers);
  };

  public getClean = async (id): Promise<any> => {
    const message = await this._gmail.users.messages.get({
      userId: 'me',
      id,
      format: format,
      metadataHeaders: REQUESTED_HEADERS,
    });

    return message;
  };

  private _normalizeMessageHeaders(headers) {
    const headerObject = {};
    headers.forEach((header) => {
      headerObject[`${header.name}`] = header.value;
    });
    return headerObject;
  }
}
