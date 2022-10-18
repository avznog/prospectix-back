import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { SlackService } from './slack.service';

@UseInterceptors(SentryInterceptor)
@Controller('slack')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-meeting-prod")
  sendMeetingProd(@CurrentUser() user: ProjectManager, @Body() prospect: Prospect) {
    return this.slackService.sendMeetingProd(user, prospect);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-meeting-staging")
  sendMeetingStaging(@CurrentUser() user: ProjectManager, @Body() prospect: Prospect) {
    return this.slackService.sendMeetingStaging(user, prospect);
  }

}
