import { Controller, Post, Body, Req, HttpCode, UseGuards, Get , ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginCdpDto } from './dto/login-cdp.dto';


@Controller('tset')
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({
    description: "credentials",
    type: RegisterDto
  })
  async logIn(@Req() request: RequestWithUser){
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const {cookie: refreshTokenCookie,token: refreshToken} = this.authService.getCookieWithJwtRefreshToken(user.id);
    
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    
    request.res?.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    return user;
    
  }

  @Post("loginldap")
  async loginldap(@Body() loginCdpDto: LoginCdpDto){
    return this.authService.login(loginCdpDto);
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
