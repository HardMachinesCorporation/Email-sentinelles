import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AbstractCrudProvider } from '../../common/abstract/abstract.crud.provider';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AbstractBaseProvider } from '../../common/abstract/abstract.base';
import { IPagination } from '../../common/abstract/types/result-with.pagination';
import { guaranteeErrorFormat } from '../../common/utils/guarantee-error.format';
import { sharedErrorHandleErrors } from '../../common/utils/shared-error.handler';
import { PasswordService } from '../password/password.service';

@Injectable()
export class ClientService extends AbstractCrudProvider<Client> {
  constructor(
    @InjectRepository(Client) userRepository: Repository<Client>,
    private readonly passwordService: PasswordService,
  ) {
    super(userRepository);
  }

  async saveToDatabase(client: CreateClientDto) {
    if (!client)
      throw new BadRequestException('Client not provided or invalid');

    const findPossibleConflictInDd = await this.findByEmail(client.email);
    if (findPossibleConflictInDd)
      throw new ConflictException(
        'Conflicts: The user you re trying to create already exist',
      );
    try {
      const hashClientPassword = await this.passwordService.securePassword(
        client.password,
      );

      return await this.createEntity({
        ...client,
        password: hashClientPassword,
      });
    } catch (error) {
      const logMessage = guaranteeErrorFormat(error)
        ? error.stack || 'Database error'
        : 'An unknown error occurred';

      const message = guaranteeErrorFormat(error)
        ? error.message || 'Failed save the client to the database'
        : 'An unknown error occurred while saving the client to the database';

      sharedErrorHandleErrors(error, logMessage, message);
    }
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
      const logMessage = guaranteeErrorFormat(error)
        ? error.stack || 'Database error'
        : 'An unknown error occurred';

      const message = guaranteeErrorFormat(error)
        ? error.message || 'Failed to fetch users'
        : 'An unknown error occurred while fetching users';

      sharedErrorHandleErrors(error, logMessage, message);
    }
  }

  async findByEmail(clientEmail: string): Promise<Client | null> {
    if (!clientEmail) {
      throw new BadRequestException('Client not provided or invalid');
    }

    try {
      return (await this.findOneByIdOrEmail(clientEmail)) || null;
    } catch (error) {
      console.log('Something goes wrong,', error);
      const isFormatted = guaranteeErrorFormat(error);

      const logMessage = isFormatted
        ? error.stack || 'Database error'
        : 'An unknown error occurred';
      const message = isFormatted
        ? error.message || `Failed to fetch the requested Client`
        : 'An unknown error occurred while fetching users';
      console.log(
        JSON.stringify({ log: logMessage, message: message }, null, 2),
      );
      // Retourne `null` en cas d'erreur pour éviter de bloquer le reste du traitement
      return null;
    }
  }
}
