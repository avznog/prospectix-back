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
import { SecondaryActivitiesService as SecondaryActivitiesService } from 'src/services/secondary-activities/secondary-activities.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';

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

  @Roles(RolesType.ADMIN, RolesType.CDP)
  @Post("add")
  create(@Body() createSecondaryActivityDto: CreateSecondaryActivityDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user)
    return this.secondaryActivitiesService.create(createSecondaryActivityDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("adjustWeightNbNo/:id")
  adjustWeightNbNo(@Param("id") id: number, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    this.secondaryActivitiesService.adjustWeightNbNo(id);
  }
}
