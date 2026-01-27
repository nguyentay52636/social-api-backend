import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    Inject,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
  import { Post, PostDocument, PostPrivacy } from './entities/post.schema';
  import { Like, LikeDocument } from './entities/like.schema';
  import { CreatePostDto } from './dtos/create-post.dto';
  import { UpdatePostDto } from './dtos/update-post.dto';
  import { FriendsService } from '../friends/friends.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
  
  @Injectable()
  export class PostsService {
    constructor(
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      @InjectModel(Post.name)
      private readonly postModel: Model<PostDocument>,
      @InjectModel(Like.name)
      private readonly likeModel: Model<LikeDocument>,
      private readonly friendsService: FriendsService,
    ) {}
  

    async createPost(userId: string, dto: CreatePostDto): Promise<PostDocument> {
      const post = await this.postModel.create({
        author: new Types.ObjectId(userId),
        content: dto.content.trim(),
        images: dto.images || [],
        privacy: dto.privacy || PostPrivacy.PUBLIC,
      });
  
      return post.populate('author', 'username avatar bio');
    }
  
  
    async getFeed(
      userId: string,
      page = 1,
      limit = 10,
    ): Promise<{
      posts: any[];
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    }> {
      const cacheKey = `feed:${userId}:page:${page}:limit:${limit}`;
    
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        console.log('⚡ Feed from Redis');
        return cached as any;
      }
    
      const skip = (page - 1) * limit;
      const friendIds = await this.getFriendIds(userId);
    
      const friendObjectIds = friendIds.map((id) => new Types.ObjectId(id));
      const userObjectId = new Types.ObjectId(userId);
    
      const query = {
        isActive: true,
        $or: [
          { privacy: PostPrivacy.PUBLIC },
          {
            privacy: PostPrivacy.FRIENDS,
            author: { $in: friendObjectIds },
          },
          { author: userObjectId },
        ],
      };
    
      const [posts, total] = await Promise.all([
        this.postModel
          .find(query)
          .populate('author', 'username avatar bio')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.postModel.countDocuments(query),
      ]);
    
      const postsWithStats = await Promise.all(
        posts.map(async (post) => {
          const [likesCount, commentsCount, isLiked] = await Promise.all([
            this.likeModel.countDocuments({ post: post._id }),
            this.getCommentsCount(post._id.toString()),
            this.likeModel.exists({
              post: post._id,
              user: userObjectId,
            }),
          ]);
    
          return {
            ...post,
            likesCount,
            commentsCount,
            isLiked: !!isLiked,
          };
        }),
      );
    
      const result = {
        posts: postsWithStats,
        total,
        page,
        limit,
        hasNext: skip + limit < total,
      };
    
      await this.cacheManager.set(cacheKey, result, 30);
    
      return result;
    }
    
  
   
    async getUserPosts(
      targetUserId: string,
      currentUserId?: string,
      page = 1,
      limit = 10,
    ): Promise<{ posts: any[]; total: number; page: number; limit: number; hasNext: boolean }> {
      const skip = (page - 1) * limit;
      const targetUserObjectId = new Types.ObjectId(targetUserId);
      const currentUserObjectId = currentUserId
        ? new Types.ObjectId(currentUserId)
        : null;
  
      if (currentUserId === targetUserId) {
        const query = {
          author: targetUserObjectId,
          isActive: true,
        };
  
        const [posts, total] = await Promise.all([
          this.postModel
            .find(query)
            .populate('author', 'username avatar bio')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          this.postModel.countDocuments(query),
        ]);
  
        const postsWithStats = await this.addPostStats(posts, currentUserId);
  
        return {
          posts: postsWithStats,
          total,
          page,
          limit,
          hasNext: skip + limit < total,
        };
      }
  
      if (!currentUserId) {
        throw new ForbiddenException('Cần đăng nhập để xem bài viết');
      }
  
      const isFriend = await this.friendsService.areFriends(
        currentUserId,
        targetUserId,
      );
  
      const query: any = {
        author: targetUserObjectId,
        isActive: true,
        $or: [
          { privacy: PostPrivacy.PUBLIC },
          ...(isFriend ? [{ privacy: PostPrivacy.FRIENDS }] : []),
        ],
      };
  
      const [posts, total] = await Promise.all([
        this.postModel
          .find(query)
          .populate('author', 'username avatar bio')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.postModel.countDocuments(query),
      ]);
  
      const postsWithStats = await this.addPostStats(posts, currentUserId);
  
      return {
        posts: postsWithStats,
        total,
        page,
        limit,
        hasNext: skip + limit < total,
      };
    }
  
    /**
     * Lấy chi tiết một bài viết
     */
    async getPostById(postId: string, userId?: string): Promise<any> {
      const post = await this.postModel
        .findById(postId)
        .populate('author', 'username avatar bio')
        .lean();
  
      if (!post || !post.isActive) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
  
      // Kiểm tra quyền xem
      if (!this.canViewPost(post, userId)) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
  
      const [likesCount, commentsCount, isLiked] = await Promise.all([
        this.likeModel.countDocuments({ post: new Types.ObjectId(postId) }),
        this.getCommentsCount(postId),
        userId
          ? this.likeModel.exists({
              post: new Types.ObjectId(postId),
              user: new Types.ObjectId(userId),
            })
          : Promise.resolve(false),
      ]);
  
      return {
        ...post,
        likesCount,
        commentsCount,
        isLiked: !!isLiked,
      };
    }
  
    /**
     * Cập nhật bài viết
     */
    async updatePost(
      postId: string,
      userId: string,
      dto: UpdatePostDto,
    ): Promise<PostDocument> {
      const post = await this.postModel.findById(postId);
  
      if (!post) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
  
      if (post.author.toString() !== userId) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
      }
  
      if (dto.content !== undefined) {
        post.content = dto.content.trim();
      }
      if (dto.images !== undefined) {
        post.images = dto.images;
      }
      if (dto.privacy !== undefined) {
        post.privacy = dto.privacy;
      }
  
      await post.save();
      return post.populate('author', 'username avatar bio');
    }
  
    /**
     * Xóa bài viết (soft delete)
     */
    async deletePost(postId: string, userId: string): Promise<void> {
      const post = await this.postModel.findById(postId);
  
      if (!post) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
  
      if (post.author.toString() !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
      }
  
      post.isActive = false;
      await post.save();
    }
  
    /**
     * Like/Unlike bài viết
     */
    async toggleLike(postId: string, userId: string): Promise<{ isLiked: boolean; likesCount: number }> {
      const post = await this.postModel.findById(postId);
  
      if (!post || !post.isActive) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
  
      const userObjectId = new Types.ObjectId(userId);
      const postObjectId = new Types.ObjectId(postId);
  
      const existingLike = await this.likeModel.findOne({
        post: postObjectId,
        user: userObjectId,
      });
  
      if (existingLike) {
        // Unlike
        await this.likeModel.deleteOne({ _id: existingLike._id });
        const likesCount = await this.likeModel.countDocuments({
          post: postObjectId,
        });
        return { isLiked: false, likesCount };
      } else {
        // Like
        await this.likeModel.create({
          post: postObjectId,
          user: userObjectId,
        });
        const likesCount = await this.likeModel.countDocuments({
          post: postObjectId,
        });
        return { isLiked: true, likesCount };
      }
    }
  
    /**
     * Lấy danh sách người đã like bài viết (giống Zalo)
     */
    async getPostLikes(
      postId: string,
      userId: string,
      page = 1,
      limit = 20,
    ): Promise<{ users: any[]; total: number }> {
      const post = await this.postModel.findById(postId);
  
      if (!post || !post.isActive) {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
  
      // Kiểm tra quyền xem
      if (!this.canViewPost(post, userId)) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
  
      const skip = (page - 1) * limit;
      const postObjectId = new Types.ObjectId(postId);
  
      const [likes, total] = await Promise.all([
        this.likeModel
          .find({ post: postObjectId })
          .populate('user', 'username avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.likeModel.countDocuments({ post: postObjectId }),
      ]);
  
      const users = likes.map((like) => (like as any).user);
  
      return { users, total };
    }
  
    // Helper methods
    private async addPostStats(posts: any[], userId?: string): Promise<any[]> {
      if (!posts.length) return [];
  
      const userObjectId = userId ? new Types.ObjectId(userId) : null;
  
      return Promise.all(
        posts.map(async (post) => {
          const [likesCount, commentsCount, isLiked] = await Promise.all([
            this.likeModel.countDocuments({ post: post._id }),
            this.getCommentsCount(post._id.toString()),
            userObjectId
              ? this.likeModel.exists({
                  post: post._id,
                  user: userObjectId,
                })
              : Promise.resolve(false),
          ]);
  
          return {
            ...post,
            likesCount,
            commentsCount,
            isLiked: !!isLiked,
          };
        }),
      );
    }
  
    private canViewPost(post: any, userId?: string): boolean {
      if (post.privacy === PostPrivacy.PUBLIC) return true;
      if (post.author._id.toString() === userId) return true;
      if (post.privacy === PostPrivacy.ONLY_ME) return false;
      // PostPrivacy.FRIENDS sẽ được kiểm tra ở service level
      return false;
    }
  
    private async getFriendIds(userId: string): Promise<string[]> {
      const friends = await this.friendsService.getFriends(userId);
      return friends.map((f) => {
        const friendId =
          (f.userId as any)._id?.toString() === userId
            ? (f.friendId as any)._id?.toString()
            : (f.userId as any)._id?.toString();
        return friendId;
      });
    }
  
    private async getCommentsCount(postId: string): Promise<number> {
      // TODO: Implement khi có CommentService
      // return this.commentService.countComments(postId);
      return 0;
    }
  }