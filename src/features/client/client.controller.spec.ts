import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;

  const mockClient: Client = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'John Doe',
    version: 1,
    deletedAt: null,
  };

  const mockClientService = {
    createEntity: jest.fn().mockResolvedValue(mockClient),
    getAllUsers: jest.fn().mockResolvedValue([mockClient]),
    findOneById: jest.fn().mockResolvedValue(mockClient),
    updateEntity: jest
      .fn()
      .mockResolvedValue({ ...mockClient, name: 'Jane Doe' }),
    deleteEntity: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    const dto: CreateClientDto = {
      email: 'test@example.com',
      password: '123456',
      name: 'John Doe',
    };
    expect(await controller.create(dto)).toEqual(mockClient);
    expect(service.createEntity).toHaveBeenCalledWith(dto);
  });

  it('should get all clients with pagination', async () => {
    expect(await controller.getAllUser(10, 1, {})).toEqual([mockClient]);
    expect(service.getAllUsers).toHaveBeenCalledWith(1, 10, {});
  });

  it('should find a client by ID', async () => {
    expect(await controller.findEntityById(1)).toEqual(mockClient);
    expect(service.findOneById).toHaveBeenCalledWith(1);
  });

  it('should update a client', async () => {
    const dto: UpdateClientDto = { name: 'Jane Doe' };
    expect(await controller.update(1, dto)).toEqual({
      ...mockClient,
      name: 'Jane Doe',
    });
    expect(service.updateEntity).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a client', async () => {
    expect(await controller.remove(1)).toEqual({ success: true });
    expect(service.deleteEntity).toHaveBeenCalledWith(1);
  });
});
