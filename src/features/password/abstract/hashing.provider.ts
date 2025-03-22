import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract comparePassword(
    password: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
  abstract hashPassword(password: string | Buffer): Promise<string>;
}
