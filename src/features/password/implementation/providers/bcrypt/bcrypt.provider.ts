import { Injectable, NotFoundException } from '@nestjs/common';
import { BcryptConfig } from './bcryp.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptProvider {
  constructor(private readonly configService: ConfigService<BcryptConfig>) {}

  private getSaltRounds(): number {
    const saltRounds = this.configService.get<BcryptConfig>('SALT_ROUNDS');
    if (!saltRounds) {
      console.error('No saltRounds found.');
      throw new NotFoundException('No saltRounds found.');
    }
    return saltRounds.SALT_ROUNDS;
  }
}
