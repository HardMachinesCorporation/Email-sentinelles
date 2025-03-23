import { PickType } from '@nestjs/mapped-types';
import { CreateClientDto } from '../../../client/dto/create-client.dto';

export class SignInDto extends PickType(CreateClientDto, [
  'password',
  'email',
]) {}
