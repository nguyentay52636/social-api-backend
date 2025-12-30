import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  statusCode: HttpStatus;
  total?: number;
}

export const ResponseUtil = {
  success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      message,
      data,
      statusCode: HttpStatus.OK,
    };
  },

  created<T>(message: string, data?: T): ApiResponse<T> {
    return {
      message,
      data,
      statusCode: HttpStatus.CREATED,
    };
  },

  list<T>(message: string, data: T[], total?: number): ApiResponse<T[]> {
    return {
      message,
      data,
      statusCode: HttpStatus.OK,
      total: total ?? data.length,
    };
  },

  deleted(message: string): ApiResponse {
    return {
      message,
      statusCode: HttpStatus.OK,
    };
  },
};

