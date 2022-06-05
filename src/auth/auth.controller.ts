import { Controller, Post, Body, Req, HttpCode, UseGuards, Res, Get , ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './localAuth.guard';
import RequestWithUser from './requestWithUser.interface';
import { response, Response } from "express";
import JwtAuthGuard from './jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import JwtRefreshGuard from './jwt-refresh.guard';


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  @Post("register")
  async register(@Body() registrationData: RegisterDto){
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async logIn(@Req() request: RequestWithUser){
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const {cookie: refreshTokenCookie,token: refreshToken} = this.authService.getCookieWithJwtRefreshToken(user.id);
    
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    
    request.res?.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return user;
    
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return request.user
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refresh(@Req() request: RequestWithUser) : User{
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);
    request.res.setHeader("Set-Cookie",accessTokenCookie);
    return request.user;
  }
}
