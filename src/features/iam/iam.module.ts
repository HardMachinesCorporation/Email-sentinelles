import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ClientModule } from '../client/client.module';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [ClientModule, PasswordModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class IamModule {}
