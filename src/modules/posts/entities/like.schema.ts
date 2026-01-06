// src/modules/posts/entities/like.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true, index: true })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ post: 1, user: 1 }, { unique: true });
LikeSchema.index({ post: 1, createdAt: -1 });
LikeSchema.index({ user: 1, createdAt: -1 });