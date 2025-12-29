/**
 * Auth & Token Interfaces
 */

export interface IDecodedAccessTokenType {
  userId: string;
  username: string;
  originalToken: string;
  key: string | number;
  iat?: number;
  exp?: number;
}

export interface IDecodedAuthTokenType {
  id: string;
  auth_code: string;
  iat?: number;
  exp?: number;
}

export interface IJwtPayload {
  sub: string; // user id
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

