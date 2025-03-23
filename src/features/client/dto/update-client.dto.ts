import { PartialType, PickType } from '@nestjs/mapped-types';
import { BaseClientDto } from './base-client.dto';

export class UpdateClientDto extends PickType(BaseClientDto, ['name']) {}
