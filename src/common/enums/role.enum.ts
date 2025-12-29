/**
 * User Roles - Phân quyền người dùng
 */

export enum RolesLevel {
  USER = 0,
  MANAGER = 1,
  ADMIN = 2,
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
}

