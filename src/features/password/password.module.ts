import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { HashingProvider } from './abstract/hashing.provider';
import { BcryptProvider } from './implementation/providers/bcrypt/bcrypt.provider';

@Module({
  providers: [
    PasswordService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    BcryptProvider,
  ],
  exports: [PasswordService],
})
export class PasswordModule {}
