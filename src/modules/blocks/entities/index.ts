import { Schema, model, Document, Types } from 'mongoose';

export interface IBlockedUser extends Document {
  user: Types.ObjectId;    
  blockedUser: Types.ObjectId; 
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedUserSchema = new Schema<IBlockedUser>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blockedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BlockedUserSchema.index(
  { user: 1, blockedUser: 1 },
  { unique: true }
);

export const BlockedUserModel = model<IBlockedUser>(
  'BlockedUser',
  BlockedUserSchema
);
