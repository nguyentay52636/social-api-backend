import { Injectable } from '@nestjs/common';
import { IInfoApiType } from 'src/interfaces/interfaces.global';

@Injectable()
export class AppService {
  constructor() {}
  getInfoApi(): IInfoApiType {
    return {
      name: 'Social Media App API',
      version: '1.0.0',
      author: 'Luca Dev',
      swagger: '/swagger',
      description: 'New Social Media API',
      contact: {
        name: 'Luca Dev',
        email: 'icaluca12@gmail.com',
        url: 'https://www.facebook.com/lucann.info',
        github: 'https://github.com/smoluca123',
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
    };
  }
}