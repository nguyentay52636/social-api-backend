import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
  } from '@nestjs/swagger';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dtos/create-post.dto';
  import { UpdatePostDto } from './dtos/update-post.dto';
  import { CurrentUser } from '../../common/decorators/current-user.decorator';
  import { ResponseUtil } from '../../common/utils';
  
  @ApiTags('Posts')
  @ApiBearerAuth()
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Đăng bài viết mới' })
    @ApiResponse({ status: 201, description: 'Đăng bài viết thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
    async createPost(
      @CurrentUser('userId') userId: string,
      @Body() dto: CreatePostDto,
    ) {
      const post = await this.postsService.createPost(userId, dto);
      return ResponseUtil.created('Đăng bài viết thành công', post);
    }
  
    @Get('feed')
    @ApiOperation({ summary: 'Lấy feed bài viết (bài viết của bạn bè và công khai)' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Lấy feed thành công' })
    async getFeed(
      @CurrentUser('userId') userId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
    ) {
      const result = await this.postsService.getFeed(
        userId,
        page ? +page : 1,
        limit ? +limit : 10,
      );
      return ResponseUtil.list('Lấy feed thành công', result.posts, result.total);
    }
  
    @Get('user/:userId')
    @ApiOperation({ summary: 'Lấy danh sách bài viết của một user' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Lấy danh sách bài viết thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền xem' })
    async getUserPosts(
      @Param('userId') targetUserId: string,
      @CurrentUser('userId') currentUserId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
    ) {
      const result = await this.postsService.getUserPosts(
        targetUserId,
        currentUserId,
        page ? +page : 1,
        limit ? +limit : 10,
      );
      return ResponseUtil.list('Lấy danh sách bài viết thành công', result.posts, result.total);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Lấy chi tiết bài viết' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Lấy chi tiết bài viết thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
    @ApiResponse({ status: 403, description: 'Không có quyền xem' })
    async getPost(
      @Param('id') postId: string,
      @CurrentUser('userId') userId: string,
    ) {
      const post = await this.postsService.getPostById(postId, userId);
      return ResponseUtil.success('Lấy chi tiết bài viết thành công', post);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Chỉnh sửa bài viết' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Chỉnh sửa bài viết thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền chỉnh sửa' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
    async updatePost(
      @Param('id') postId: string,
      @CurrentUser('userId') userId: string,
      @Body() dto: UpdatePostDto,
    ) {
      const post = await this.postsService.updatePost(postId, userId, dto);
      return ResponseUtil.success('Chỉnh sửa bài viết thành công', post);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Xóa bài viết' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Xóa bài viết thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
    async deletePost(
      @Param('id') postId: string,
      @CurrentUser('userId') userId: string,
    ) {
      await this.postsService.deletePost(postId, userId);
      return ResponseUtil.deleted('Xóa bài viết thành công');
    }
  
    @Post(':id/like')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Thích/Bỏ thích bài viết' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Thích/Bỏ thích thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
    async toggleLike(
      @Param('id') postId: string,
      @CurrentUser('userId') userId: string,
    ) {
      const result = await this.postsService.toggleLike(postId, userId);
      return ResponseUtil.success('Thích/Bỏ thích thành công', result);
    }
  
    @Get(':id/likes')
    @ApiOperation({ summary: 'Lấy danh sách người đã thích bài viết' })
    @ApiParam({ name: 'id', description: 'Post ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Lấy danh sách người thích thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
    async getPostLikes(
      @Param('id') postId: string,
      @CurrentUser('userId') userId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
    ) {
      const result = await this.postsService.getPostLikes(
        postId,
        userId,
        page ? +page : 1,
        limit ? +limit : 20,
      );
      return ResponseUtil.list('Lấy danh sách người thích thành công', result.users, result.total);
    }
  }