import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryService } from '../sentry/sentry.service';
import { SlackService } from './slack.service';

@UseInterceptors(SentryInterceptor)
@Controller('slack')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("slack")
export class SlackController {
  constructor(
    private readonly slackService: SlackService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("send-fraud")
  sendFraud(@CurrentUser() user: ProjectManager, @Body() prospect: Prospect) {
    this.sentryService.setSentryUser(user);
    return this.slackService.sendFraud(prospect, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("send-champ")
  async sendChamp(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.slackService.sendChampSlack(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("send-pm-reminder")
  async sendPmReminder(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.slackService.sendPmReminder();
  } 
}
