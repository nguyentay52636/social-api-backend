import { Request } from 'express';
import { IDecodedAccessTokenType, IDecodedAuthTokenType } from './auth.interface';

/**
 * Extended Request Interfaces
 */

export interface IRequestWithDecodedAccessToken extends Request {
  decodedAccessToken: IDecodedAccessTokenType;
}

export interface IRequestWithDecodedAuthToken extends Request {
  user: IDecodedAuthTokenType;
}

export interface IRequestWithFullSession extends IRequestWithDecodedAccessToken {
  sessionId: string;
}

export interface IAuthenticatedRequest extends Request {
  user: {
    userId: string;
    email?: string;
    username?: string;
  };
}

