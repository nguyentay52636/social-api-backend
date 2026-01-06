// src/modules/posts/entities/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

export enum PostPrivacy {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  ONLY_ME = 'only_me',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  author: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: String,
    enum: Object.values(PostPrivacy),
    default: PostPrivacy.PUBLIC,
  })
  privacy: PostPrivacy;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ privacy: 1, createdAt: -1 });
PostSchema.index({ isActive: 1, createdAt: -1 });
PostSchema.index({ isActive: 1, privacy: 1, createdAt: -1 });