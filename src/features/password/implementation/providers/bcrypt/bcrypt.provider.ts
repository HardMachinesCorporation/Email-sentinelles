import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import BcrypConfig, { BcryptConfig } from './bcryp.config';
import { ConfigService } from '@nestjs/config';
import { HashingProvider } from '../../../abstract/hashing.provider';
import bcrypt from 'bcryptjs';
import { guaranteeErrorFormat } from '../../../../../common/utils/guarantee-error.format';
import { sharedErrorHandleErrors } from '../../../../../common/utils/shared-error.handler';
import bcryptConfig from './bcryp.config'; // ✅ On importe directement la config validée

@Injectable()
export class BcryptProvider implements HashingProvider {
  private readonly saltRounds: number = bcryptConfig.SALT_ROUNDS; // ✅ On récupère directement la valeur validée
  constructor() {
    console.log(
      '✅ SALT_ROUNDS loaded:',
      this.saltRounds,
      'Type:',
      typeof this.saltRounds,
    );
  }

  async comparePassword(password: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }

  async hashPassword(password: string) {
    const saltRounds = this.saltRounds;
    try {
      console.log(
        `Try to use genSalt with salround as :${saltRounds} of type ${typeof saltRounds}`,
      );
      const salt: string = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      const loggMessage = guaranteeErrorFormat(error)
        ? error.stack || 'Failed to Hash Password'
        : 'Something went wrong';
      sharedErrorHandleErrors(error, loggMessage);
    }
  }
}
