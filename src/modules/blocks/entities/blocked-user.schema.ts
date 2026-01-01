import { Schema, model, Document, Types } from 'mongoose';

export enum BlockType {
  MESSAGE = 'message',
  CALL = 'call',
  SEARCH = 'search',
  ALL = 'all',
}

export enum BlockSource {
  USER = 'user',
  REPORT = 'report',
  SYSTEM = 'system',
}

export interface IBlockedUser extends Document {
  user: Types.ObjectId;
  blockedUser: Types.ObjectId;
  reason?: string;
  blockType: BlockType;
  source: BlockSource;
  isActive: boolean;
  expiresAt?: Date;
}

const BlockedUserSchema = new Schema<IBlockedUser>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    blockType: {
      type: String,
      enum: Object.values(BlockType),
      default: BlockType.ALL,
    },
    source: {
      type: String,
      enum: Object.values(BlockSource),
      default: BlockSource.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// unique block per user pair
BlockedUserSchema.index(
  { user: 1, blockedUser: 1 },
  { unique: true }
);

// TTL auto delete when expired
BlockedUserSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const BlockedUserModel = model<IBlockedUser>(
  'BlockedUser',
  BlockedUserSchema
);
