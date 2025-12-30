import { Schema, model, Document, Types } from 'mongoose';

export interface IFriend extends Document {
  userId: Types.ObjectId;    // người dùng hiện tại
  friendId: Types.ObjectId;  // bạn của người đó
  createdAt: Date;
}

const FriendSchema = new Schema<IFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);


FriendSchema.index(
  { userId: 1, friendId: 1 },
  { unique: true }
);


FriendSchema.index({ userId: 1 });
FriendSchema.index({ friendId: 1 });

export const FriendModel = model<IFriend>('Friend', FriendSchema);
