import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { UpdateWebsiteDto } from 'src/dto/websites/update-website.dto';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { SentryService } from 'src/services/sentry/sentry.service';

import { WebsitesService } from 'src/services/websites/websites.service';
import { UpdateResult } from 'typeorm';

@UseInterceptors(SentryInterceptor)
@Controller('websites')
@ApiTags("websites")
@UseGuards(JwtAuthGuard, RolesGuard)
export class WebsitesController {
  constructor(
    private readonly websitesService: WebsitesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") idWebsite: number, @Body() updateWebsiteDto: UpdateWebsiteDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.websitesService.update(idWebsite, updateWebsiteDto);
  }
}
