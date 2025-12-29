export interface IJwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

