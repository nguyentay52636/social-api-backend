import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppInfo, IHealthCheck } from '@/common/interfaces';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getAppInfo(): IAppInfo {
    return {
      name: 'Social Media App API',
      version: '1.0.0',
      author: 'nguyentay52636',
      description: 'Social Media API - Like Zalo',
      swagger: '/api/docs',
      contact: {
        name: 'nguyentay52636',
        email: 'nguyentay52636@gmail.com',
        url: 'https://www.facebook.com/nguyentay52636',
        github: 'https://github.com/nguyentay52636',
      },
    };
  }

  getHealth(): IHealthCheck {
    return {
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime(),
      environment: this.config.get<string>('app.nodeEnv', 'development'),
    };
  }
}
