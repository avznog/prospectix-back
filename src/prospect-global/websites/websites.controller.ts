import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { UpdateResult } from 'typeorm';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { WebsitesService } from './websites.service';

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
