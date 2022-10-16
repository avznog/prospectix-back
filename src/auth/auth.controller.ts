import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { LoginPmDto } from './dto/login-project-manager.dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor, SentryInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post("login")
  async loginldap(@Body() loginPmDto: LoginPmDto, @Res({ passthrough: true }) response: Response) {
    if(!await this.authService.login(loginPmDto))
      throw new HttpException(
        "Vos identifiants LDAP sont corrects, mais vous n'avez pas encore de compte Prospectix",
        HttpStatus.UNAUTHORIZED
      );

    response.cookie("refresh-token", this.authService.getRefreshToken(loginPmDto.username), {
      expires: new Date(Date.now() + (+process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000),
      httpOnly: true,
      path: "/auth/refresh"
    })

    return {
      accessToken: this.authService.getAccessToken(loginPmDto.username)
    }
  }

  @Get("logout")
  @HttpCode(200)
  logOut(@Res({ passthrough: true }) response: Response)  {
    response.cookie("refresh-token", "", {
      expires: new Date("1999"),
      httpOnly: true,
    })
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refresh(@Req() request: Request) {
    const refreshToken = request.cookies["refresh-token"]
    if(typeof refreshToken != "string")
      throw new UnauthorizedException("no refresh token")

    const accessToken = this.authService.refreshToken(refreshToken)

    return {
      accessToken,
    }
  }
}
