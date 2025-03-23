import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  readonly email!: string;
  @MinLength(10)
  readonly password!: string;
  @IsString()
  readonly name!: string;
}
