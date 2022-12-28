import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Param, Query } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { GoogleService } from './google.service';

@UseInterceptors(SentryInterceptor)
@Controller('google')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("google")
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("logout")
  logout(@CurrentUser() user: ProjectManager) {
    return this.googleService.logout(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("check-logged")
  checkLogged(@CurrentUser() user: ProjectManager) : Promise<boolean> {
    return this.googleService.checkLogged(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("auth")
  auth() {
    return this.googleService.auth()
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("oauth2callback/:code")
  aouth2callback(@Param("code") code: string, @CurrentUser() user: ProjectManager) {
    return this.googleService.retrieveTokens(code, user);
  }
}
