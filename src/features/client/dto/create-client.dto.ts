import { BaseClientDto } from './base-client.dto';
import { IsString } from 'class-validator';

export class CreateClientDto extends BaseClientDto {
  @IsString()
  readonly password!: string;
}
