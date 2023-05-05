import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SecondaryActivitiesService } from './secondary-activities.service';


@UseInterceptors(SentryInterceptor)
@Controller('secondary-activities')
@ApiTags("secondary-activities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecondaryActivitiesController {
  constructor(
    private readonly secondaryActivitiesService: SecondaryActivitiesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll(@CurrentUser() user: ProjectManager) : Promise<SecondaryActivity[]> {
    this.sentryService.setSentryUser(user)
    return this.secondaryActivitiesService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("adjustWeightNbNo/:id")
  adjustWeightNbNo(@Param("id") id: number, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    this.secondaryActivitiesService.adjustWeightNbNo(id);
  }
}
