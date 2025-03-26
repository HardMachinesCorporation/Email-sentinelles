import {
  Body,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from '../../client/client.service';
import { SignUpDto } from './dto/sign-up.dto';
import { DatabaseError } from '../../../common/errors/database-error';
import { Client } from '../../client/entities/client.entity';
import { SignInDto } from './dto/sign-in.dto';
import { PasswordService } from '../../password/password.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import JwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { IActiveUser } from '../interfaces/active-user-data.interface';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly clientService: ClientService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  async signup(customer: SignUpDto) {
    try {
      await this.clientService.saveToDatabase(customer);
      return { message: 'Sign up successfully.' };
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        throw new DatabaseError(
          String((error as any).code),
          error.message,
          error,
        );
      }
      throw error;
    }
  }

  async signIn(customer: SignInDto) {
    const getKnownClient: Client = await this.clientService.findOneByIdOrEmail(
      customer.email,
    );

    if (!getKnownClient) {
      console.warn(
        `Tentative de connexion échouée pour l'email: ${customer.email}`,
      );
      throw new UnauthorizedException();
    }

    const isValidCredential: boolean =
      await this.passwordService.validatePassword(
        customer.password,
        getKnownClient.password,
      );

    if (!isValidCredential) {
      console.warn(`Mot de passe invalide pour l'email: ${customer.email}`);
      throw new UnauthorizedException("Passwords or Email don't match.");
    }
    return await this.reGenerateTokens(getKnownClient);
  }

  public async reGenerateTokens(getKnownClient: Client) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken<Partial<IActiveUser>>(
        getKnownClient.id,
        this.jwtConfig.accessTokenTtl,
        { email: getKnownClient.email },
      ),
      this.generateToken(getKnownClient.id, this.jwtConfig.refreshTokenTtl),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: RefreshTokenDTO) {
    const { sub } = await this.jwtService.verifyAsync<Pick<IActiveUser, 'sub'>>(
      refreshToken.refreshToken,
      {
        secret: this.jwtConfig.secret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
      },
    );
    if (!sub) {
      throw new UnauthorizedException(
        'Your credentials are not well configured.',
      );
    }
    const client = await this.clientService.findOneByIdOrEmail(sub);
    if (!client) {
      throw new UnauthorizedException(
        "You don't enough right to have access to this service.",
      );
    }
    return this.reGenerateTokens(client);
  }

  private async generateToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ) {
    // TODO we fille fill this gap later
    return await this.jwtService.signAsync(
      {
        userId,
        ...payload,
      },
      {
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        secret: this.jwtConfig.secret,
        expiresIn,
      },
    );
  }
}
