import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './features/client/client.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [ClientModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
