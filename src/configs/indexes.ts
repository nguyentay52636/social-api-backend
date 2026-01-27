import { Connection } from 'mongoose';
import { Db } from 'mongodb';

export async function createIndexes(connection: Connection) {
  const db = connection.db as Db;

  // Posts indexes
  await db.collection('posts').createIndexes([
    { key: { author: 1, createdAt: -1 } },
    { key: { privacy: 1, isActive: 1, createdAt: -1 } },
    { key: { isActive: 1 } },
  ]);

  await db.collection('likes').createIndexes([
    { key: { post: 1, user: 1 }, unique: true },
    { key: { post: 1 } },
    { key: { user: 1 } },
  ]);

  await db.collection('messages').createIndexes([
    { key: { room: 1, createdAt: -1 } },
    { key: { sender: 1 } },
  ]);

  await db.collection('rooms').createIndexes([
    { key: { participants: 1 } },
    { key: { updatedAt: -1 } },
  ]);

  await db.collection('friends').createIndexes([
    { key: { userId: 1, friendId: 1 }, unique: true },
    { key: { friendId: 1, userId: 1 } },
  ]);

}