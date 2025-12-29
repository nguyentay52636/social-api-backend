import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/entities/user.schema';
import { LoginDto, RegisterDto } from './dto';
import { IAuthResponse, IAuthTokens, ITokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user with encrypted password
   */
  async register(dto: RegisterDto): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ phone: dto.phone }, { username: dto.username }, { email: dto.email }],
    });

    if (existingUser) {
      if (existingUser.username === dto.username) {
        throw new ConflictException('Username already taken');
      }
      if (existingUser.phone === dto.phone) {
        throw new ConflictException('Phone number already registered');
      }
      if (dto.email && existingUser.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
    }

    // Hash password with bcrypt
    const hashedPassword = await this.hashPassword(dto.password);

    // Create user
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      tokens,
    };
  }

  /**
   * Authenticate user and return tokens
   */
  async login(dto: LoginDto): Promise<IAuthResponse> {
    // Find user by username or phone, include password field
    const user = await this.userModel
      .findOne({
        $or: [{ username: dto.identifier }, { phone: dto.identifier }],
      })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last seen
    await this.userModel.findByIdAndUpdate(user._id, { lastSeen: new Date() });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<IAuthTokens> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<ITokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Find user
      const user = await this.userModel.findById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Validate user by ID (used by JWT strategy)
   */
  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId).select('+password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await this.comparePasswords(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: UserDocument): Promise<IAuthTokens> {
    const accessTokenPayload: ITokenPayload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      type: 'access',
    };

    const refreshTokenPayload: ITokenPayload = {
      sub: user._id.toString(),
      username: user.username,
      type: 'refresh',
    };

    const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload as object, {
        secret: jwtSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(refreshTokenPayload as object, {
        secret: jwtSecret,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare plain password with hashed password
   */
  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

