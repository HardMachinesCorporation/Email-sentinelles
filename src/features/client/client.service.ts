import { HttpException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AbstractCrudProvider } from '../../common/abstract/abstract.crud.provider';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AbstractBaseProvider } from '../../common/abstract/abstract.base';
import { IPagination } from '../../common/abstract/types/result-with.pagination';

@Injectable()
export class ClientService extends AbstractCrudProvider<Client> {
  constructor(@InjectRepository(Client) userRepository: Repository<Client>) {
    super(userRepository);
  }

  async getAllUsers(
    page: number,
    limit: number,
    filter: FindOptionsWhere<Client>,
  ) {
    const pagination: IPagination<Client> = { page: page, limit: limit };
    try {
      return this.findAll(pagination);
    } catch (error) {
      throw Error(error.stack);
    }
  }
}
