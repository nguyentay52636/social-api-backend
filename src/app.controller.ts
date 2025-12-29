import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IAppInfo, IHealthCheck } from '@/common/interfaces';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAppInfo(): IAppInfo {
    return this.appService.getAppInfo();
  }

  @Get('health')
  getHealth(): IHealthCheck {
    return this.appService.getHealth();
  }
}
