import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RoleName {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager',
}
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Role {
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
  })
  status: RoleStatus;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
