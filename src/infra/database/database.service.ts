// database.service.ts
import { neon } from '@neondatabase/serverless';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NeonConfig } from './config/config-type';
import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class DatabaseService {
  private sql;

  constructor(
    private configService: ConfigService<NeonConfig>,
    private readonly entityManager: EntityManager,
  ) {
    this.sql = this.initialize();
  }
  async getData<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    const repository: Repository<T> = this.entityManager.getRepository(entity);
    const tableName: string = repository.metadata.tableName;

    if (!tableName) {
      throw new BadRequestException('Entity does not have a valid table name');
    }

    // Exécuter la requête SQL en évitant l'injection SQL
    return await this.sql`SELECT * FROM ${this.sql.unsafe(tableName)}`;
  }
  private initialize() {
    const url = this.configService.get<string>('DATABASE_URL');
    if (!url) throw new BadRequestException('Wrong Configuration');

    return neon(url);
  }
}
