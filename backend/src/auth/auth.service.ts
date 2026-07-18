import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        role: "USER",
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is deactivated");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    await this.prisma.refreshToken.delete({
      where: { id: existingToken.id },
    });

    const tokens = await this.generateTokens(
      existingToken.user.id,
      existingToken.user.email,
      existingToken.user.role
    );

    return {
      user: this.sanitizeUser(existingToken.user),
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    } catch {
      // Token might already be deleted — ignore
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return this.sanitizeUser(user);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenValue = uuidv4();
    const refreshTokenExpiresIn =
      this.configService.get<string>("REFRESH_TOKEN_EXPIRATION") || "7d";

    const expiresAt = new Date();
    const match = refreshTokenExpiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const amount = parseInt(match[1]!, 10);
      const unit = match[2];
      switch (unit) {
        case "d":
          expiresAt.setDate(expiresAt.getDate() + amount);
          break;
        case "h":
          expiresAt.setHours(expiresAt.getHours() + amount);
          break;
        case "m":
          expiresAt.setMinutes(expiresAt.getMinutes() + amount);
          break;
        case "s":
          expiresAt.setSeconds(expiresAt.getSeconds() + amount);
          break;
      }
    }

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
    createdAt: Date;
    passwordHash?: string;
  }) {
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
