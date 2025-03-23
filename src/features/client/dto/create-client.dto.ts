import { BaseClientDto } from './base-client.dto';
import { IsString, MinLength } from 'class-validator';

export class CreateClientDto extends BaseClientDto {
  @IsString()
  @MinLength(10)
  readonly password!: string;
}
