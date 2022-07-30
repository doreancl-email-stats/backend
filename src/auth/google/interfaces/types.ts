interface Email {
  value: string;
  verified: boolean;
}

interface Photo {
  value: string;
}

export interface Profile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Email[];
  photos: Photo[];
  provider: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}
