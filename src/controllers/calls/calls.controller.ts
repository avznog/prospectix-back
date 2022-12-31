import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateCallDto } from 'src/dto/calls/create-call.dto';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { CallsService } from 'src/services/calls/calls.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';

@UseInterceptors(SentryInterceptor)
@Controller('calls')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("calls")
export class CallsController {
  constructor(
    private readonly callsService: CallsService,
    private readonly sentryService: SentryService
  ) {}

  @Roles(RolesType.CDP,RolesType.ADMIN)
  @Post()
  create(@Body() createCallDto: CreateCallDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.callsService.create(createCallDto);
  }

  @Roles(RolesType.CDP,RolesType.ADMIN)
  @Post("create-for-me")
  createForMe(@Body() createCallDto: CreateCallDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.callsService.createForMe(createCallDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.callsService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.callsService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.callsService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-everyone")
  countAllForEveryOne(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.callsService.countAllForEveryOne();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.callsService.countAllByWeeksForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-all")
  countWeeklyAll(@CurrentUser() user: ProjectManager) : Promise<{id: number, count: number}[]> {
    this.sentryService.setSentryUser(user);
    return this.callsService.countWeeklyAll();
  }
}
