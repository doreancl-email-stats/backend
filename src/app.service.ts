import { Injectable, Logger } from '@nestjs/common';
import { GmailService } from './google/gmail/gmail.service';
import { SheetsService } from './google/sheet/sheets.service';
import { google } from 'googleapis';
import { User } from './users/schemas/user.schema';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly gmailService: GmailService,
    private readonly sheetsService: SheetsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processEmailToSheet() {
    // Start User
    // Todo: this will be a custom route, to execute from frontend with the logged user data
    const user: User = await this.usersService.findOneBy({
      user_id: process.env.EXAMPLE_GOOGLE_USER_ID,
    });
    // End User

    // Auth
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    });

    const credentials = {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    };

    auth.setCredentials(credentials);
    // End Auth

    // Start gmail service
    // Todo create factory or best implementation on app.module for instance with
    // this already seated
    this.gmailService.gmail = google.gmail({ version: 'v1', auth: auth });
    this.sheetsService.sheet = google.sheets({ version: 'v4', auth: auth });
    //End gmail service

    await this.recursivePagination();

    return 'Hello asd!';
  }

  private async recursivePagination(pageToken = null) {
    //Start get email
    const pageChunk = await this.gmailService.list(pageToken);
    const emailsHeaders = [];
    for (const chunk of pageChunk.messages) {
      const emailHeaders = await this.gmailService.get(chunk.id);
      emailsHeaders.push([
        emailHeaders['Delivered-To'],
        emailHeaders.Subject,
        emailHeaders.From,
        emailHeaders.To,
        emailHeaders.Date,
      ]);

      if (emailsHeaders.length > 10000) {
        //Start send to sheets
        await this.sheetsService.append(
          process.env.EXAMPLE_GOOGLE_SHEET_ID,
          emailsHeaders,
        );
        emailsHeaders.length = 0; // https://stackoverflow.com/a/1232046/1351242
        //End send to sheets
      }
    }

    //Start send to sheets the rest
    await this.sheetsService.append(
      process.env.EXAMPLE_GOOGLE_SHEET_ID,
      emailsHeaders,
    );
    emailsHeaders.length = 0; // https://stackoverflow.com/a/1232046/1351242
    //End send to sheets the rest

    //End get email

    //Start recursive
    if (pageChunk.nextPageToken) {
      await this.recursivePagination(pageChunk.nextPageToken);
    }
    //End recursive
  }
}
