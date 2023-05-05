import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCallDto } from 'src/actions/calls/dto/create-call.dto';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { CallsService } from './calls.service';


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

  // ? calls ordered by weeks for all cdp
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

  @Roles(RolesType.ADMIN)
  @Get("count-calls-for-week-all-pm")
  countCallsForWeekAllPm(@CurrentUser() user: ProjectManager, @Query() interval: {dateDown: Date, dateUp: Date }) : Promise<{id: number, count: number}[]> {
    this.sentryService.setSentryUser(user);
    return this.callsService.countCallsForWeekAllPm(interval);
  } 
}
