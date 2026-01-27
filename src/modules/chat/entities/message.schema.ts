
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.schema';
import { Room } from './room.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, versionKey: false })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
    room: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    readBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
