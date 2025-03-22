import { ConfigService } from '@nestjs/config';
import { neonSchema } from '../schema/database.schema';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const configService: ConfigService = new ConfigService();
export type NeonConfig = z.infer<typeof neonSchema>;

export default () => {
  configService.get<NeonConfig>('DATABASE_URL');
};
