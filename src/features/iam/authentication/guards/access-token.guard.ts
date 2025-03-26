import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import request from 'supertest';
import { REQUEST_USER_KEY } from '../iam.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly JwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly JwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(ctx);
    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to access this route',
      );
    }
    try {
      const payload = await this.JwtService.verifyAsync(
        token,
        this.JwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
      console.log('Log de le AccessToken. le payload est', payload);
    } catch (error) {
      throw new UnauthorizedException(
        'You do not have a valid credentials to access this route',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token ?? undefined;
  }
}
