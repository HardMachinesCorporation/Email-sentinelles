import { Test, TestingModule } from '@nestjs/testing';
import { AbstractCrud } from './abstract.crud.provider';

describe('AbstractCrud', () => {
  let provider: AbstractCrud;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractCrud],
    }).compile();

    provider = module.get<AbstractCrud>(AbstractCrud);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
