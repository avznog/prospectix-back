import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { SentryService } from '../sentry/sentry.service';
import { GoogleService } from './google.service';


@UseInterceptors(SentryInterceptor)
@Controller('google')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("google")
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("logout")
  logout(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.googleService.logout(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("check-logged")
  checkLogged(@CurrentUser() user: ProjectManager) : Promise<boolean> {
    this.sentryService.setSentryUser(user);
    return this.googleService.checkLogged(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("auth")
  auth(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.googleService.auth()
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("oauth2callback/:code")
  aouth2callback(@Param("code") code: string, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.googleService.retrieveTokens(code, user);
  }
}
