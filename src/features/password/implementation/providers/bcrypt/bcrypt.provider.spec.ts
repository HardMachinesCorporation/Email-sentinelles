import { BcryptProvider } from './bcrypt.provider';
import bcrypt from 'bcryptjs';
import bcryptConfig from './bcryp.config';
import dotenv from 'dotenv';
dotenv.config();

describe('BcryptProvider', () => {
  let bcryptProvider: BcryptProvider;

  beforeEach(() => {
    bcryptProvider = new BcryptProvider(); // ✅ Pas besoin de `ConfigService`
  });

  it('✅ Devrait charger correctement SALT_ROUNDS', () => {
    expect(bcryptProvider['saltRounds']).toBe(bcryptConfig.SALT_ROUNDS);
  });

  it('✅ Devrait hacher un mot de passe', async () => {
    const password = 'securePassword';
    const hash = await bcryptProvider.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
    expect(hash.startsWith('$2b$')).toBeTruthy(); // Vérifie que bcrypt est utilisé
  });

  it('✅ Devrait comparer un mot de passe avec un hash valide', async () => {
    const password = 'securePassword';
    const hash = await bcrypt.hash(password, bcryptConfig.SALT_ROUNDS);

    const isValid = await bcryptProvider.comparePassword(password, hash);
    expect(isValid).toBeTruthy();
  });

  it('❌ Devrait retourner `false` si le mot de passe est incorrect', async () => {
    const password = 'securePassword';
    const wrongPassword = 'wrongPassword';
    const hash = await bcrypt.hash(password, bcryptConfig.SALT_ROUNDS);

    const isValid = await bcryptProvider.comparePassword(wrongPassword, hash);
    expect(isValid).toBeFalsy();
  });
});
