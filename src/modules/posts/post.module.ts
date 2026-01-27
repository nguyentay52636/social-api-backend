import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './entities/post.schema';
import { Like, LikeSchema } from './entities/like.schema';
import { FriendsModule } from '../friends/friends.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    FriendsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
}) 
export class PostsModule {}