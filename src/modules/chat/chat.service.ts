
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './entities/room.schema';
import { Message, MessageDocument } from './entities/message.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) { }

    async createOrGetRoom(userId: string, friendId: string) {
        // Check if direct room exists
        // We want to ensure it's a direct chat between ONLY these two people
        // $all matches arrays containing these elements, but might match bigger groups. 
        // For DIRECT, we usually want size 2.
        // simpler approach for now:
        const room = await this.roomModel.findOne({
            participants: { $all: [userId, friendId], $size: 2 },
            type: 'DIRECT',
        })
            .populate('participants', 'username avatar email phone')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'username avatar' }
            });

        if (room) {
            return room;
        }

        const newRoom = new this.roomModel({
            participants: [userId, friendId],
            type: 'DIRECT',
        });
        await newRoom.save();
        return newRoom.populate('participants', 'username avatar email phone');
    }

    async sendMessage(senderId: string, roomId: string, content: string) {
        const newMessage = new this.messageModel({
            room: roomId,
            sender: senderId,
            content,
        });
        await newMessage.save();

        await this.roomModel.findByIdAndUpdate(roomId, {
            lastMessage: newMessage._id,
        });

        return newMessage.populate('sender', 'username avatar');
    }

    async getMessages(roomId: string, limit = 50, skip = 0) {
        return this.messageModel
            .find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'username avatar')
            .exec();
    }

    async getUserRooms(userId: string) {
        return this.roomModel
            .find({ participants: userId })
            .populate('participants', 'username avatar email phone')
            .populate({
                path: 'lastMessage',
                model: 'Message',
                populate: {
                    path: 'sender',
                    model: 'User',
                    select: 'username avatar'
                }
            })
            .sort({ updatedAt: -1 });
    }
}
