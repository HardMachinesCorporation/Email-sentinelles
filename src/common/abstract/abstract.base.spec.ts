import { Test, TestingModule } from '@nestjs/testing';
import { AbstractBase } from './abstract.base';

describe('AbstractBase', () => {
  let provider: AbstractBase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractBase],
    }).compile();

    provider = module.get<AbstractBase>(AbstractBase);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
