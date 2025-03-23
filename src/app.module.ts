import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './features/client/client.module';
import { DatabaseModule } from './infra/database/database.module';
import { PasswordModule } from './features/password/password.module';
import { IamModule } from './features/iam/iam.module';

@Module({
  imports: [ClientModule, DatabaseModule, PasswordModule, IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
