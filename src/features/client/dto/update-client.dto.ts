import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { BaseClientDto } from './base-client.dto';

export class UpdateClientDto extends PartialType(BaseClientDto) {}
