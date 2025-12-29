import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtModuleConfig: JwtModuleAsyncOptions = {
  global: true,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('jwt.secret'),
    signOptions: {
      expiresIn: config.get<string>('jwt.accessTokenExpiresIn', '15m') as any,
    },
  }),
};

