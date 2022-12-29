import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateActivityDto } from 'src/dto/activities/create-activity.dto';
import { Activity } from 'src/entities/activities/activity.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ActivitiesService } from 'src/services/activities/activities.service';

@UseInterceptors(SentryInterceptor)
@Controller('activities')
@ApiTags("activities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Roles(RolesType.ADMIN, RolesType.CDP)
  @Post("add")
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }
}
