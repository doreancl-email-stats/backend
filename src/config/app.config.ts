import { AppConfig } from './interfaces';

export default (): AppConfig => ({
  port: parseInt(process.env.PORT) || 3000,

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresInSeconds:
        parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS) || 60 * 60 * 8, // 8 Days
    },
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACKURL,
    },
  },
  google: {
    gmailListMaxResults: process.env.GOOGLE_MESSAGES_LIST_MAXRESULTS,
    example_google_user_id: process.env.EXAMPLE_GOOGLE_USER_ID,
    example_google_sheet_id: process.env.EXAMPLE_GOOGLE_SHEET_ID,
  },
});
