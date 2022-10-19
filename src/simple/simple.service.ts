import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { google } from 'googleapis';
import { UsersService } from '../users/users.service';
import { GmailService } from '../google/gmail/gmail.service';
import { MessagesService } from 'src/messages/messages.service';
import { Message } from '../messages/interfaces/message.interface';

const MAX_CHUNK_SIZE = 10000;

@Injectable()
export class SimpleService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly gmailService: GmailService,
    private readonly messagesService: MessagesService,
  ) {}

  async getOneRaw(id = null) {
    const auth = await this.getAuth();
    this.gmailService.gmail = google.gmail({ version: 'v1', auth: auth });

    if (!id) {
      const pageChunk = await this.gmailService.list(null, 1);
      for (const chunk of pageChunk.messages) {
        return await this.gmailService.getClean(chunk.id);
      }
    } else {
      return await this.gmailService.getClean(id);
    }
  }

  async getAuth() {
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

    return auth;
  }

  async simpleGmail() {
    const auth = await this.getAuth();

    // Start gmail service
    // Todo create factory or best implementation on app.module for instance with
    // this already seated
    this.gmailService.gmail = google.gmail({ version: 'v1', auth: auth });

    //End gmail service

    return await this.recursivePagination();

    //return 'super nice!';
  }

  format(message) {
    try {
      const formatedMessage: Message = {
        ...message,
        internalDate: new Date(parseInt(message.internalDate)),
      };
      return formatedMessage;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  private async recursivePagination(pageToken = null) {
    //Start get email
    const pageChunk = await this.gmailService.list(pageToken);
    const emailsHeaders = [];
    for (const chunk of pageChunk.messages) {
      const emailHeaders = await this.gmailService.getClean(chunk.id);

      const formatedMessage = this.format(emailHeaders.data);
      emailsHeaders.push(formatedMessage);

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
