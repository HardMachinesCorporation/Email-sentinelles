import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingProvider } from './abstract/hashing.provider';
import { sharedErrorHandleErrors } from '../../common/utils/shared-error.handler';

@Injectable()
export class PasswordService {
  constructor(private readonly bcryptService: HashingProvider) {}

  async validatePassword(
    providedPassword: string | Buffer,
    storedPassword: string,
  ): Promise<boolean> {
    if (!providedPassword || !storedPassword)
      throw new UnauthorizedException(
        'You must specify a valid password or email',
      );
    try {
      // 🔑 This function return false if the password do not match
      return await this.bcryptService.comparePassword(
        providedPassword,
        storedPassword,
      );
    } catch (error) {
      // TODO later improve logger
      const logMessage = `Password validation failed', ${error}`;
      return sharedErrorHandleErrors(error, logMessage);
    }
  }

  async securePassword(providedPassword: string | Buffer): Promise<string> {
    if (!providedPassword)
      throw new UnauthorizedException(
        'You must specify a valid password or email',
      );
    try {
      // 🔑 This function fail if the password do not match
      return await this.bcryptService.hashPassword(providedPassword);
    } catch (error) {
      // TODO later improve logger
      const logMessage = `Password hash failed ${error}`;
      return sharedErrorHandleErrors(error, logMessage);
    }
  }
}
