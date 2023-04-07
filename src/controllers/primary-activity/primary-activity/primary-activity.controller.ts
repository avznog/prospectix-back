import { Controller, UseGuards, UseInterceptors, Get } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { PrimaryActivity } from 'src/entities/primary-activity/primary-activity.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { PrimaryActivityService } from 'src/services/primary-activity/primary-activity/primary-activity.service';

@UseInterceptors(SentryInterceptor)
@Controller('primary-activities')
@ApiTags("primary-activities")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class PrimaryActivityController {

  constructor(
    private readonly primaryActivityServices: PrimaryActivityService
  ) {}

  @Get("find-all")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll() : Promise<PrimaryActivity[]> {
    return this.primaryActivityServices.findAll();
  }
  
}
