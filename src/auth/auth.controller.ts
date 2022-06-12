import {Controller,Post,Body,Req,HttpCode,UseGuards,Get,ClassSerializerInterceptor,UseInterceptors} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import JwtAuthGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { ApiTags } from '@nestjs/swagger';
import { LoginPmDto } from './dto/login-pm.dto';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import RequestWithPm from './interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';


@Controller('auth')
@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly pmService: ProjectManagersService
    ) {}

  @HttpCode(200)
  @Post("loginldap")
  async loginldap(@Body() loginPmDto: LoginPmDto, @Req() request: RequestWithPm){
    return this.authService.login(loginPmDto, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(200)
  async logOut(@Req() request: RequestWithPm) : Promise<ProjectManager>{
    await this.pmService.removeRefreshToken(request.pm.pseudo);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return request.pm;
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refresh(@Req() request: RequestWithPm) : ProjectManager{
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.pm.pseudo);
    request.res.setHeader("Set-Cookie",accessTokenCookie);
    return request.pm;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithPm) {
      const user = request.pm;
      user.pseudo = undefined;
      return user;
  }
}
