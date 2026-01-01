import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configs, mongooseConfig, jwtModuleConfig } from './configs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/users/roles/role.module';
import { FriendRequestModule } from './modules/friends-request/friends-request.module';
import { FriendsModule } from './modules/friends/friends.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs, envFilePath: ['.env.local', '.env'] }),
    MongooseModule.forRootAsync(mongooseConfig),
    JwtModule.registerAsync(jwtModuleConfig),
    UsersModule,
    AuthModule,
    RolesModule,
    FriendRequestModule,
    FriendsModule,
    BlocksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
