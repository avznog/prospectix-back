import { 
  Controller, 
  Post,
  Body,
  Req,
  HttpCode,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalAuthGuard } from './guards/localAuth.guard';
import JwtAuthGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { ApiTags } from '@nestjs/swagger';
import { LoginCdpDto } from './dto/login-cdp.dto';
import { Cdp } from 'src/cdp/entities/cdp.entity';
import RequestWithCdp from './interfaces/requestWithCdp.interface';
import { CdpService } from 'src/cdp/cdp.service';


@Controller('auth')
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cdpService: CdpService
    ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post("loginldap")
  async loginldap(@Body() loginCdpDto: LoginCdpDto, @Req() request: RequestWithCdp){
    return this.authService.login(loginCdpDto, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(200)
  async logOut(@Req() request: RequestWithCdp) : Promise<Cdp>{
    await this.cdpService.removeRefreshToken(request.cdp.pseudo);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return request.cdp;
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refresh(@Req() request: RequestWithCdp) : Cdp{
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.cdp.pseudo);
    request.res.setHeader("Set-Cookie",accessTokenCookie);
    return request.cdp;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithCdp) {
      const user = request.cdp;
      user.pseudo = undefined;
      return user;
  }
}
