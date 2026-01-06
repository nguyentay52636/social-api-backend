import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty({ description: 'ID của tác giả' })
  _id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Avatar', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Bio', required: false })
  bio?: string;
}

export class PostResponseDto {
  @ApiProperty({ description: 'ID của bài viết' })
  _id: string;

  @ApiProperty({ description: 'Tác giả', type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty({ description: 'Nội dung bài viết' })
  content: string;

  @ApiProperty({ description: 'Danh sách hình ảnh', type: [String] })
  images: string[];

  @ApiProperty({ description: 'Quyền riêng tư' })
  privacy: string;

  @ApiProperty({ description: 'Số lượt thích' })
  likesCount: number;

  @ApiProperty({ description: 'Số lượt bình luận' })
  commentsCount: number;

  @ApiProperty({ description: 'Đã thích chưa' })
  isLiked: boolean;

  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  updatedAt: Date;
}

export class PostListResponseDto {
  @ApiProperty({ description: 'Danh sách bài viết', type: [PostResponseDto] })
  data: PostResponseDto[];

  @ApiProperty({ description: 'Tổng số bài viết' })
  total: number;

  @ApiProperty({ description: 'Trang hiện tại' })
  page: number;

  @ApiProperty({ description: 'Số lượng mỗi trang' })
  limit: number;

  @ApiProperty({ description: 'Có trang tiếp theo không' })
  hasNext: boolean;
}