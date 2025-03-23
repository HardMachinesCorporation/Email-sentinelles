import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract comparePassword(
    password: string,
    encrypted: string,
  ): Promise<boolean>;
  abstract hashPassword(password: string): Promise<string>;
}
