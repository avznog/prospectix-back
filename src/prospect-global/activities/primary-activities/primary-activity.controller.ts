import { Controller, UseGuards, UseInterceptors, Get, Param } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { PrimaryActivityService } from './primary-activity.service';
import { SentryService } from 'src/apis/sentry/sentry.service';


@UseInterceptors(SentryInterceptor)
@Controller('primary-activities')
@ApiTags("primary-activities")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrimaryActivityController {

  constructor(
    private readonly primaryActivityServices: PrimaryActivityService,
    private readonly sentryService: SentryService
  ) {}

  @Get("find-all")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll(@CurrentUser() user: ProjectManager) : Promise<PrimaryActivity[]> {
    this.sentryService.setSentryUser(user);
    return this.primaryActivityServices.findAll();
  }

  @Get("find-all-without-limit")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllWithoutLimit(@CurrentUser() user: ProjectManager) : Promise<PrimaryActivity[]> {
    this.sentryService.setSentryUser(user);
    return this.primaryActivityServices.findAllWithoutLimit();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("adjustWeightNbNo/:id")
  adjustWeightNbNo(@Param("id") id: number, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    this.primaryActivityServices.adjustWeightNbNo(id);
  }
}
