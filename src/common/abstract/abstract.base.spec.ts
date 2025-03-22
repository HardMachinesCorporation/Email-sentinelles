import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

import {
  IPagination,
  ResultWithPagination,
} from './types/result-with.pagination';
import { AbstractBaseProvider } from './abstract.base';

// Exemple d'entité simulée pour le test
class MockEntity {
  id: number;
  email?: string;
  name: string;
  createdAt: Date;
}

describe('AbstractBaseProvider', () => {
  let provider: AbstractBaseProvider<MockEntity>;
  let mockRepository: Partial<Repository<MockEntity>>;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AbstractBaseProvider,
          useValue: new (class extends AbstractBaseProvider<MockEntity> {
            constructor() {
              super(mockRepository as Repository<MockEntity>);
            }
          })(),
        },
      ],
    }).compile();

    provider =
      module.get<AbstractBaseProvider<MockEntity>>(AbstractBaseProvider);
  });

  // ✅ Test de la récupération d'une entité par ID (succès)
  it('should find an entity by ID', async () => {
    const entity: MockEntity = {
      id: 1,
      name: 'Test Entity',
      createdAt: new Date(),
    };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(entity);

    const result = await provider.findOneById(1);
    expect(result).toEqual(entity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      lock: { mode: 'pessimistic_read' },
    });
  });

  // ❌ Test d'erreur si l'ID n'existe pas
  it('should throw NotFoundException if entity by ID does not exist', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(provider.findOneById(999)).rejects.toThrow(NotFoundException);
  });

  // ✅ Test de la récupération par condition (succès)
  it('should find an entity by condition', async () => {
    const entity: MockEntity = {
      id: 2,
      name: 'Condition Entity',
      createdAt: new Date(),
    };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(entity);

    const condition: FindOptionsWhere<MockEntity> = {
      name: 'Condition Entity',
    };
    const result = await provider.findByCondition(condition);
    expect(result).toEqual(entity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: condition });
  });

  // ❌ Test d'erreur si aucune entité ne correspond à la condition
  it('should throw NotFoundException if no entity matches the condition', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(provider.findByCondition({ name: 'Unknown' })).rejects.toThrow(
      NotFoundException,
    );
  });

  // ✅ Test de la récupération paginée (succès)
  it('should return paginated data', async () => {
    const entities: MockEntity[] = [
      { id: 1, name: 'Entity 1', createdAt: new Date() },
      { id: 2, name: 'Entity 2', createdAt: new Date() },
    ];
    (mockRepository.findAndCount as jest.Mock).mockResolvedValue([entities, 2]);

    const pagination: IPagination<MockEntity> = {
      page: 1,
      limit: 2,
      filter: {},
    };
    const result = await provider.findAll(pagination);
    expect(result).toEqual({
      data: entities,
      total: 2,
      page: 1,
      limit: 2,
    });
    expect(mockRepository.findAndCount).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 2,
      order: { createdAt: 'DES' },
    });
  });

  // ✅ Test de `findOneByIdOrEmail` avec ID
  it('should find an entity by ID using findOneByIdOrEmail', async () => {
    const entity: MockEntity = {
      id: 1,
      name: 'Test Entity',
      createdAt: new Date(),
    };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(entity);

    const result = await provider.findOneByIdOrEmail(1);
    expect(result).toEqual(entity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  // ✅ Test de `findOneByIdOrEmail` avec email
  it('should find an entity by email using findOneByIdOrEmail', async () => {
    const entity: MockEntity = {
      id: 3,
      email: 'test@example.com',
      name: 'Email Entity',
      createdAt: new Date(),
    };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(entity);

    const result = await provider.findOneByIdOrEmail('test@example.com');
    expect(result).toEqual(entity);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  // ❌ Test de `findOneByIdOrEmail` si aucun résultat
  it('should throw NotFoundException if entity does not exist in findOneByIdOrEmail', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(provider.findOneByIdOrEmail(999)).rejects.toThrow(
      NotFoundException,
    );
    await expect(
      provider.findOneByIdOrEmail('notfound@example.com'),
    ).rejects.toThrow(NotFoundException);
  });
});
