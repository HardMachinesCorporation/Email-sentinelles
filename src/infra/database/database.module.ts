import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { neonSchema } from './schema/database.schema';
import { validateConfig } from '../../common/validation/shared.validation.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './datasource/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => validateConfig(config, neonSchema),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => DatabaseConfiguration(new Logger('TypeORM')),
    }),
  ],
  providers: [Logger],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
