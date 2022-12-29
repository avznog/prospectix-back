import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { Prospect } from 'src/entities/prospects/prospect.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { SlackService } from 'src/services/slack/slack.service';

@UseInterceptors(SentryInterceptor)
@Controller('slack')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-fraud")
  sendFraud(@CurrentUser() user: ProjectManager, @Body() prospect: Prospect) {
    return this.slackService.sendFraud(prospect, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("send-champ")
  async sendChamp(@CurrentUser() user: ProjectManager) {
    return this.slackService.sendChampSlack(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("send-pm-reminder")
  async sendPmReminder() {
    return this.slackService.sendPmReminder();
  } 
}
