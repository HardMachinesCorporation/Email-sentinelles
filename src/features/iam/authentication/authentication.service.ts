import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from '../../client/client.service';
import { SignUpDto } from './dto/sign-up.dto';
import { DatabaseError } from '../../../common/errors/database-error';
import { Client } from '../../client/entities/client.entity';
import { SignInDto } from './dto/sign-in.dto';
import { PasswordService } from '../../password/password.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly clientService: ClientService,
    private readonly passwordService: PasswordService,
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

    // TODO we fille fill this gap later
    return true;
  }
}
