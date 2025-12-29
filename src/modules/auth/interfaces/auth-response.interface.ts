export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthUser {
  userId: string;
  username: string;
  email?: string;
  phone: string;
}

export interface IAuthResponse {
  user: IAuthUser;
  tokens: IAuthTokens;
}

export interface ITokenPayload {
  sub: string;
  username: string;
  email?: string;
  type: 'access' | 'refresh';
}

export interface IRefreshTokenPayload {
  sub: string;
  username: string;
  type: 'refresh';
}

