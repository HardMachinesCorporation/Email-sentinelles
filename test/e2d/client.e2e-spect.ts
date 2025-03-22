import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ClientService } from '../../src/features/client/client.service';
import { CreateClientDto } from '../../src/features/client/dto/create-client.dto';
import { UpdateClientDto } from '../../src/features/client/dto/update-client.dto';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  let clientService = {
    createEntity: jest
      .fn()
      .mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
      }),
    getAllUsers: jest
      .fn()
      .mockResolvedValue([
        { id: 1, email: 'test@example.com', name: 'John Doe' },
      ]),
    findOneById: jest
      .fn()
      .mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
      }),
    updateEntity: jest
      .fn()
      .mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        name: 'Jane Doe',
      }),
    deleteEntity: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ClientService)
      .useValue(clientService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST) - should create a new client', () => {
    const dto: CreateClientDto = {
      email: 'test@example.com',
      password: '123456',
      name: 'John Doe',
    };
    return request(app.getHttpServer())
      .post('/user')
      .send(dto)
      .expect(201)
      .expect(clientService.createEntity());
  });

  it('/user (GET) - should return all clients', () => {
    return request(app.getHttpServer())
      .get('/user?limit=10&page=1')
      .expect(200)
      .expect(clientService.getAllUsers());
  });

  it('/user/:id (GET) - should return a client by ID', () => {
    return request(app.getHttpServer())
      .get('/user/1')
      .expect(200)
      .expect(clientService.findOneById());
  });

  it('/user/:id (PATCH) - should update a client', () => {
    const dto: UpdateClientDto = { name: 'Jane Doe' };
    return request(app.getHttpServer())
      .patch('/user/1')
      .send(dto)
      .expect(200)
      .expect(clientService.updateEntity());
  });

  it('/user/:id (DELETE) - should delete a client', () => {
    return request(app.getHttpServer())
      .delete('/user/1')
      .expect(200)
      .expect(clientService.deleteEntity());
  });
});
