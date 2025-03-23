import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProviderNaive {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Valeur fixe pour simplifier
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }
}
