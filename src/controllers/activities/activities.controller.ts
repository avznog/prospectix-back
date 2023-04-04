import { Body, Controller, Get, Post, UseGuards, UseInterceptors, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateSecondaryActivityDto } from 'src/dto/secondary-activities/create-secondary-activity.dto';
import { SecondaryActivity } from 'src/entities/secondary-activities/secondary-activity.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ActivitiesService } from 'src/services/secondary-activities/secondary-activities.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';

@UseInterceptors(SentryInterceptor)
@Controller('activities')
@ApiTags("activities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll(@CurrentUser() user: ProjectManager) : Promise<SecondaryActivity[]> {
    this.sentryService.setSentryUser(user)
    return this.activitiesService.findAll();
  }

  @Roles(RolesType.ADMIN, RolesType.CDP)
  @Post("add")
  create(@Body() createActivityDto: CreateSecondaryActivityDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user)
    return this.activitiesService.create(createActivityDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("adjustWeightNbNo/:id")
  adjustWeightNbNo(@Param("id") id: number, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    this.activitiesService.adjustWeightNbNo(id);
  }
}
