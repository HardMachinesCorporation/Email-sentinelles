import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [ClientModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class IamModule {}
