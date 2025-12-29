import { Socket } from 'socket.io';
import { UserDocument } from '@/modules/users/entities/user.schema';
import { IDecodedAccessTokenType } from './auth.interface';

/**
 * Socket.IO Interfaces - Real-time messaging
 */

export interface ISocketWithAuth extends Socket {
  data: {
    user: UserDocument;
    decodedAccessToken: IDecodedAccessTokenType;
  };
}

export interface ISocketUser {
  odId: string;
  username: string;
  socketId: string;
  connectedAt: Date;
}

