// Configuration TypeORM
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestJsTypeOrmLogger } from '../logger/typeorm.logger';
import * as dotenv from 'dotenv';
import { guaranteeErrorFormat } from '../../../common/utils/guarantee-error.format';
import { sharedErrorHandleErrors } from '../../../common/utils/shared-error.handler';
dotenv.config();

const configService = new ConfigService();
let databaseUrl: string;

try {
  databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
} catch (error) {
  const loggedMessage = guaranteeErrorFormat(error)
    ? error.message || 'Failed to load database url'
    : 'An unknown error occurred';
  sharedErrorHandleErrors(error, loggedMessage, 'Bad Configuration');
}

export const DatabaseConfiguration = (
  nestLogger: Logger,
): DataSourceOptions => {
  return {
    type: 'postgres',
    url: databaseUrl,
    entities:
      configService.getOrThrow<string>('NODE_ENV') === 'production'
        ? ['dist/feature/client/*.entity.js']
        : ['src/feature/client/*.entity.ts'], // Utilisation des fichiers compilés
    migrations:
      configService.getOrThrow<string>('NODE_ENV') === 'production'
        ? ['dist/infra/database/migrations/*.js']
        : ['src/infra/database/migrations/*.ts'], // Migrations compilées
    synchronize: false, // Toujours false en production
    logger: new NestJsTypeOrmLogger(nestLogger),
    extra: {
      ssl: { rejectUnauthorized: false },
    },
  };
};

/// Exporter DataSource pour TypeORM CLI et migrations
const nestLogger = new Logger('TypeORM');
export const dataSource = new DataSource(DatabaseConfiguration(nestLogger));
