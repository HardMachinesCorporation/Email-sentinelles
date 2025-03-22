import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

// Logger personnalisé pour TypeORM dans NestJS
export class NestJsTypeOrmLogger implements TypeOrmLogger {
  constructor(private readonly nestLogger: Logger) {}

  logQuery(query: string, parameters?: any[]) {
    this.nestLogger.debug(
      `Query: ${query} Parameters: ${JSON.stringify(parameters || [])}`,
      'TypeORM',
    );
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.nestLogger.error(
      `Query Error: ${error} - Query: ${query} Parameters: ${JSON.stringify(parameters || [])}`,
      'TypeORM',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.nestLogger.warn(
      `Slow Query (${time}ms): ${query} Parameters: ${JSON.stringify(parameters || [])}`,
      'TypeORM',
    );
  }

  logSchemaBuild(message: string) {
    this.nestLogger.log(message, 'TypeORM');
  }

  logMigration(message: string) {
    this.nestLogger.log(message, 'TypeORM');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.nestLogger.log(message, 'TypeORM');
        break;
      case 'info':
        this.nestLogger.log(message, 'TypeORM');
        break;
      case 'warn':
        this.nestLogger.warn(message, 'TypeORM');
        break;
    }
  }
}
