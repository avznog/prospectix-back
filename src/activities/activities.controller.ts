import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';

@Controller('activities')
@ApiTags("activities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Activity[]> {
    return this.activitiesService.findAll();
  }
}
