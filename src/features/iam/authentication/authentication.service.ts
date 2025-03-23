import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { ClientService } from '../../client/client.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly clientService: ClientService) {}

  async signup(customer: SignUpDto) {
    try {
      return this.clientService.saveToDatabase(customer);
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code == pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }
}
