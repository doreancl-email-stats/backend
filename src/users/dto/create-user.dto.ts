export class CreateUserDto {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly email_verified: boolean;
  readonly is_active: boolean;
  readonly last_login: string;
  readonly created_at: string;
  //profile
  readonly provider: string;
  readonly user_id: string;
  readonly connection: string;
  readonly access_token: string;
  readonly refresh_token: string;
}
