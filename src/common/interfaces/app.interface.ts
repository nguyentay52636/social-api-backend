/**
 * App Interfaces
 */

export interface IAppContact {
  name: string;
  email: string;
  url?: string;
  github?: string;
}

export interface IAppInfo {
  name: string;
  version: string;
  author: string;
  description: string;
  swagger: string;
  contact: IAppContact;
}

export interface IHealthCheck {
  status: 'ok' | 'error';
  timestamp: Date;
  uptime: number;
  environment: string;
}

