import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  Repository,
  UpdateResult,
} from 'typeorm';
import { AbstractCrudProvider } from './abstract.crud.provider';

// Exemple d'entité simulée pour le test
class MockEntity {
  id!: number;
  name!: string;
}

describe('AbstractCrudProvider', () => {
  let provider: AbstractCrudProvider<MockEntity>;
  let mockRepository: Partial<Repository<MockEntity>>;

  beforeEach(async () => {
    mockRepository = {
      create: jest
        .fn()
        .mockImplementation(
          (data: DeepPartial<MockEntity>) => data,
        ) as jest.Mock,
      save: jest
        .fn()
        .mockImplementation((entity) => Promise.resolve({ ...entity, id: 1 })),
      update: jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult),
      delete: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Entity' }),
    };

    class MockCrudProvider extends AbstractCrudProvider<MockEntity> {
      constructor(repository: Repository<MockEntity>) {
        super(repository);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AbstractCrudProvider,
          useValue: new MockCrudProvider(
            mockRepository as Repository<MockEntity>,
          ),
        },
      ],
    }).compile();

    provider =
      module.get<AbstractCrudProvider<MockEntity>>(AbstractCrudProvider);
  });

  // ✅ Test de la création d'entité (cas réussi)
  it('should create an entity successfully', async () => {
    const data: DeepPartial<MockEntity> = { name: 'New Entity' };
    const result = await provider.createEntity(data);
    expect(result).toEqual({ name: 'New Entity', id: 1 });
    expect(mockRepository.save).toHaveBeenCalledWith({ name: 'New Entity' });
  });

  // ❌ Test d'erreur de conflit lors de la création d'une entité existante
  it('should throw ConflictException if entity already exists', async () => {
    (mockRepository.save as jest.Mock).mockRejectedValue({ code: '23505' });
    const data: DeepPartial<MockEntity> = { name: 'Duplicate Entity' };
    await expect(provider.createEntity(data)).rejects.toThrow(
      ConflictException,
    );
  });

  // ❌ Test d'erreur interne lors de la création
  it('should throw HttpException if an unknown error occurs during creation', async () => {
    (mockRepository.save as jest.Mock).mockRejectedValue(new Error('DB error'));
    const data: DeepPartial<MockEntity> = { name: 'Fail Entity' };
    await expect(provider.createEntity(data)).rejects.toThrow(HttpException);
  });

  // ✅ Test de la mise à jour d'une entité existante
  it('should update an entity successfully', async () => {
    const updatedData = { name: 'Updated Entity' };
    const result = await provider.updateEntity(1, updatedData);
    expect(result).toEqual({ id: 1, name: 'Test Entity' }); // Doit retourner l'entité trouvée après mise à jour
    expect(mockRepository.update).toHaveBeenCalledWith(1, updatedData);
  });

  // ❌ Test d'erreur si l'entité à mettre à jour n'existe pas
  it('should throw HttpException if entity not found during update', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      provider.updateEntity(999, { name: 'Nonexistent' }),
    ).rejects.toThrow(HttpException);
  });

  // ❌ Test d'erreur si la mise à jour ne modifie rien
  it('should throw HttpException if update does not affect any row', async () => {
    (mockRepository.update as jest.Mock).mockResolvedValue({
      affected: 0,
    } as UpdateResult);
    await expect(
      provider.updateEntity(1, { name: 'No Change' }),
    ).rejects.toThrow(HttpException);
  });

  // ✅ Test de la suppression d'une entité existante
  it('should delete an entity successfully', async () => {
    const result = await provider.deleteEntity(1);
    expect(result).toEqual({
      message: 'Entity with ID1 was successfully deleted',
      success: true,
      date: expect.any(Date),
    });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  // ❌ Test d'erreur si l'entité à supprimer n'existe pas
  it('should throw HttpException if entity not found during delete', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue({
      affected: 0,
    } as DeleteResult);
    await expect(provider.deleteEntity(999)).rejects.toThrow(HttpException);
  });
});
