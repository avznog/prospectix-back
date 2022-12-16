import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { GoogleService } from './google.service';

@UseInterceptors(SentryInterceptor)
@Controller('google')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("logout")
  logout() {
    return this.googleService.logout();
  }

}
