import { Schema, model, Document, Types } from 'mongoose';

export enum FriendRequestStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface IFriendRequest extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FriendRequestStatus),
      default: FriendRequestStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FriendRequestSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

FriendRequestSchema.index(
  { receiver: 1, status: 1 }
);

export const FriendRequestModel = model<IFriendRequest>(
  'FriendRequest',
  FriendRequestSchema
);
