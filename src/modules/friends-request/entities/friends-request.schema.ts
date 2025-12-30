import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

export enum FriendRequestStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class FriendRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(FriendRequestStatus),
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

// Unique index: chỉ cho phép 1 request từ A -> B
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

FriendRequestSchema.index({ receiver: 1, status: 1 });
