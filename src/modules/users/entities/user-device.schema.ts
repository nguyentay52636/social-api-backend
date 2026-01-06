import { Schema, Types, Document } from "mongoose";

export interface IUserDevice extends Document {
  userId: Types.ObjectId;
  deviceId: string;
  deviceName?: string;
  ipAddress?: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const userDeviceSchema = new Schema<IUserDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    ipAddress: String,
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

userDeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

