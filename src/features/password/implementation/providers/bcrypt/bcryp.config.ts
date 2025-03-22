import { ConfigService } from '@nestjs/config';
import { bcryptSchema } from './bcrypt.schema';
import { z } from 'zod';

const configService = new ConfigService();
export type BcryptConfig = z.infer<typeof bcryptSchema>;

export default () => ({
  SALT_ROUNDS: configService.get<BcryptConfig>('SALT_ROUNDS'),
});
