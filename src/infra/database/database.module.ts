import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { neonSchema } from './schema/database.schema';
import { validateConfig } from '../../common/validation/shared.validation.config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './datasource/data-source';
import { DataSource } from 'typeorm';
import { Injector } from '@nestjs/core/injector/injector';

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
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ - The app is successfully connected to database');
    } catch (error) {
      console.error('❌ Erreur de connexion à la base de données :', error);
    }
  }
}
