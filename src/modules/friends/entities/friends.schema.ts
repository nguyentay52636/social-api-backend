import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendDocument = Friend & Document;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  friendId: Types.ObjectId;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

FriendSchema.index({ userId: 1 });
FriendSchema.index({ friendId: 1 });
