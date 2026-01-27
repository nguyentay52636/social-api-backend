
import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly chatService: ChatService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.split(' ')[1];

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            // Join user to their own room for notifications if needed
            client.join(payload.sub);
            console.log(`Client connected: ${client.id}, User: ${payload.sub}`);
        } catch (e) {
            console.error('Connection unauthorized', e);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        client.join(roomId);
        console.log(`User ${client.data.user?.sub} joined room ${roomId}`);
        return { event: 'joined_room', data: roomId };
    }

    @SubscribeMessage('leave_room')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        client.leave(roomId);
        return { event: 'left_room', data: roomId };
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string; content: string },
    ) {
        const userId = client.data.user.sub;
        const message = await this.chatService.sendMessage(
            userId,
            payload.roomId,
            payload.content,
        );

        // Emit to room
        this.server.to(payload.roomId).emit('receive_message', message);
        return message;
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string; isTyping: boolean },
    ) {
        client.to(payload.roomId).emit('typing', {
            userId: client.data.user.sub,
            isTyping: payload.isTyping,
        });
    }
}
