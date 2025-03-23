import { IClient } from '../interface/client.interface';
import { IsEmail, IsString } from 'class-validator';

export class BaseClientDto implements IClient {
  @IsEmail()
  readonly email!: string;
  @IsString()
  readonly name!: string;
}
