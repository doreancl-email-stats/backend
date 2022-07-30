import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class SheetsService {
  set sheet(value: any) {
    this._sheet = value;
  }

  private _sheet: any;

  constructor(private readonly logger: Logger) {}

  create = async (title = 'DEFAULT TITLE') => {
    try {
      const body = {
        requestBody: {
          properties: {
            title,
          },
        },
      };
      const spreadsheet = await this._sheet.spreadsheets.create(body);
      return spreadsheet.data.spreadsheetId;
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  };

  append = async (spreadsheetId = 'DEFAULT_SHEET_ID', values) => {
    this.logger.log(`[INFO] -- Sending ${values.length}`);
    const append = {
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values,
      },
    };
    return await this._sheet.spreadsheets.values.append(append);
  };
}
