import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

const format = 'metadata';

@Injectable()
export class GmailService {
  set gmail(value: any) {
    this._gmail = value;
  }

  private _gmail: any;

  private readonly _maxResults =
    process.env.GOOGLE_MESSAGES_LIST_MAXRESULTS || 500; // https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list?hl=en_US#query-parameters

  public list = async (pageToken = null) => {
    const res1 = await this._gmail.users.messages.list({
      userId: 'me',
      pageToken: pageToken,
      maxResults: this._maxResults,
    });
    return res1.data;
  };

  public get = async (id): Promise<any> => {
    const message = await this._gmail.users.messages.get({
      userId: 'me',
      // id: res1.data.messages[0].id,
      id,
      format: format,
      metadataHeaders: ['Delivered-To', 'Subject', 'From', 'To', 'Date'],
    });

    return this._normalizeMessageHeaders(message.data.payload.headers);
  };

  private _normalizeMessageHeaders(headers) {
    const headerObject = {};
    headers.forEach((header) => {
      headerObject[`${header.name}`] = header.value;
    });
    return headerObject;
  }
}
