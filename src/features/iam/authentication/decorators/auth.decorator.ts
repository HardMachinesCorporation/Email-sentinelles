import { AuthType } from '../enums/auth-type.enum.ts';
import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KET = 'authType';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KET, authTypes);
