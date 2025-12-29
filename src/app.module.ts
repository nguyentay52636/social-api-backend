import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configs } from './configs';

@Module({
  imports: [
    // Global Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),

    // JWT Module
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessTokenExpiresIn'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
