
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.schema';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true, versionKey: false })
export class Room {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: Types.ObjectId[];

    @Prop({ type: String, enum: ['DIRECT', 'GROUP'], default: 'DIRECT' })
    type: string;

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage?: Types.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
