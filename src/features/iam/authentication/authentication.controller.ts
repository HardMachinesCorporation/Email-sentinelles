import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum.ts';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  signUP(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signup(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDTO) {
    return this.authenticationService.refreshToken(refreshToken);
  }
  // si success 200 au lieu du default 200 de nestjs
  @HttpCode(HttpStatus.OK)
  @Post('login-cookies')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessToken = await this.authenticationService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  // si success 200 au lieu du default 200 de nestjs
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }
}
