# Social API Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://www.mongodb.com/" target="blank"><img src="https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" width="120" alt="MongoDB Logo" /></a>
</p>

## Description

**Social API Backend** là hệ thống Backend mạnh mẽ cho ứng dụng mạng xã hội, được xây dựng bằng **[NestJS](https://github.com/nestjs/nest)** framework.

Dự án cung cấp các API cần thiết để quản lý người dùng, kết bạn, chặn người dùng và các tính năng xã hội khác, sử dụng cơ sở dữ liệu **MongoDB**.

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **NestJS** | 11.x | Framework Node.js hiệu quả, có khả năng mở rộng |
| **MongoDB** | - | Database NoSQL |
| **Mongoose** | 9.x | ODM cho MongoDB |
| **JWT** | - | Xác thực người dùng (JSON Web Tokens) |
| **Socket.IO** | - | Real-time communication (sắp tới) |
| **Redis** | - | Caching & Adapter cho Socket.IO (sắp tới) |
| **Swagger** | - | API Documentation |

## ✨ Tính năng chính

- **� Authentication & Authorization (AuthModule)**
  - Đăng ký, Đăng nhập (JWT)
  - Quản lý phiên đăng nhập (Access Token, Refresh Token)
  - Bảo vệ routes bằng Guards

- **manage users (UsersModule)**
  - CRUD User Profile
  - Tìm kiếm người dùng

- **� Bạn bè (FriendsRequestModule & FriendsModule)**
  - **Gửi lời mời kết bạn**: Tránh spam, kiểm tra trùng lặp.
  - **Chấp nhận / Từ chối**: Xử lý logic thêm bạn bè hoặc xoá lời mời.
  - **Huỷ lời mời**:
    - Hỗ trợ huỷ bằng `Request ID`.
    - Hỗ trợ huỷ bằng `Receiver ID` (người nhận).
  - **Danh sách bạn bè**: Xem danh sách, xoá bạn.

- **� Chặn người dùng (BlocksModule)**
  - Chặn / Bỏ chặn người dùng.
  - Kiểm tra trạng thái chặn khi tương tác.

- **🛡️ Phân quyền (RolesModule)**
  - Quản lý Role (Admin, User, etc.)

## 📝 API Documentation

Dự án tích hợp **Swagger UI** để xem và test API.
Sau khi chạy ứng dụng, truy cập vào đường dẫn:
```
http://localhost:3000/api
```

## � Cài đặt và Chạy

### 1. Yêu cầu tiên quyết
- Node.js (v18+)
- MongoDB (Local hoặc Atlas)
- Redis (Optional - cho tính năng real-time nâng cao)

### 2. Cài đặt dependencies

```bash
$ npm install
```

### 3. Cấu hình môi trường (`.env`)
Tạo file `.env` hoặc `.env.local` ở thư mục gốc và cấu hình các biến môi trường cần thiết (MongoDB URI, JWT Secret, Redis Host, ...).

### 4. Chạy ứng dụng

```bash
# development
$ npm run start

# watch mode (khuyên dùng khi code)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📂 Cấu trúc thư mục (Modules chính)

```
src/
├── modules/
│   ├── auth/            # Xác thực
│   ├── users/           # Quản lý người dùng & Roles
│   ├── friends/         # Quản lý bạn bè
│   ├── friends-request/ # Quản lý lời mời kết bạn
│   ├── blocks/          # Quản lý chặn người dùng
│   └── ...
├── configs/             # Cấu hình hệ thống (Database, JWT...)
├── common/              # Decorators, Guards, Utils dùng chung
└── main.ts              # Entry point
```

## License

Dự án này là [UNLICENSED](LICENSE).
