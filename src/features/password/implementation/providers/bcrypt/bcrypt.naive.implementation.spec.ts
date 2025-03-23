import bcrypt from 'bcryptjs';
import { BcryptProviderNaive } from './bcrypt.naive.implementation';

describe('BcryptProviderNaive', () => {
  let provider: BcryptProviderNaive;

  beforeEach(() => {
    provider = new BcryptProviderNaive();
    jest.clearAllMocks();
  });

  it('should hash password correctly', async () => {
    // Mocking genSalt et hash avec l'approche suggérée
    const bcryptGenSalt = jest.fn().mockResolvedValue('fakeSalt');
    (bcrypt.genSalt as jest.Mock) = bcryptGenSalt;

    const bcryptHash = jest.fn().mockResolvedValue('hashedPassword');
    (bcrypt.hash as jest.Mock) = bcryptHash;

    const result = await provider.hashPassword('myPassword');

    expect(result).toBe('hashedPassword');
    expect(bcryptGenSalt).toHaveBeenCalledWith(10);
    expect(bcryptHash).toHaveBeenCalledWith('myPassword', 'fakeSalt');
  });

  it('should compare passwords correctly', async () => {
    // Mocking compare avec l'approche suggérée
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await provider.comparePassword(
      'myPassword',
      'hashedPassword',
    );

    expect(result).toBe(true);
    expect(bcryptCompare).toHaveBeenCalledWith('myPassword', 'hashedPassword');
  });

  it('should handle errors from bcrypt.compare', async () => {
    const bcryptCompare = jest
      .fn()
      .mockRejectedValue(new Error('Random error'));
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    await expect(
      provider.comparePassword('myPassword', 'hashedPassword'),
    ).rejects.toThrow('Random error');
  });
});
