export interface AppConfig {
  port: number;
  FRONTEND_URL: string;
  COOKIE_DOMAIN: string;
  IGNORE_EXPIRATION: boolean;
  auth: {
    jwt: {
      secret: string;
      expiresInSeconds: number;
    };
    google: {
      clientId: string;
      clientSecret: string;
      callbackURL: string;
    };
  };
  google: {
    gmailListMaxResults: string;
    example_google_user_id: string;
    example_google_sheet_id: string;
  };
  'auth.jwt.secret'?: string;
  'auth.jwt.expiresInSeconds'?: number;
  'auth.github.clientId'?: string;
  'auth.github.clientSecret'?: string;
  'auth.github.callbackURL'?: string;
  'auth.google.clientId'?: string;
  'auth.google.clientSecret'?: string;
  'auth.google.callbackURL'?: string;
}
