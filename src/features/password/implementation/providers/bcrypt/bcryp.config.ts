import { bcryptSchema } from './bcrypt.schema';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
dotenv.config();
// ✅ On récupère les valeurs d'environnement UNE SEULE FOIS
const configService = new ConfigService();
const validatedConfig = bcryptSchema.parse({
  SALT_ROUNDS: configService.get('SALT_ROUNDS'),
});

export type BcryptConfig = typeof validatedConfig;

export default validatedConfig; // ✅ On retourne directement la config validée
