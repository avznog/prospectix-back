import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateMeetingDto } from 'src/dto/meetings/create-meeting.dto';
import { ResearchParamsMeetingsDto } from 'src/dto/meetings/research-params-meetings.dto';
import { UpdateMeetingDto } from 'src/dto/meetings/update-meeting.dto';
import { Meeting } from 'src/entities/meetings/meeting.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { MeetingsService } from 'src/services/meetings/meetings.service';
import { SentryService } from 'src/services/sentry/sentry/sentry.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@UseInterceptors(SentryInterceptor)
@Controller('meetings')
@ApiTags("meetings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto, @CurrentUser() user: ProjectManager) : Promise<Meeting> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.create(createMeetingDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("delete/:id")
  delete(@Param("id") idMeeting: number, @CurrentUser() user: ProjectManager) : Promise<DeleteResult> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.delete(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-done/:id")
  markDone(@Param("id") idMeeting: number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.markDone(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-undone/:id")
  markUndone(@Param("id") idMeeting: number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.markUndone(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsMeetingsDto: ResearchParamsMeetingsDto, @CurrentUser() user: ProjectManager) : Promise<Meeting[]> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.findAllPaginated(researchParamsMeetingsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-meetings-done")
  findAllMeetingsDone(@Query() researchParamsMeetingsDto: ResearchParamsMeetingsDto, @CurrentUser() user: ProjectManager) : Promise<Meeting[]> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.findAllMeetingsDone(researchParamsMeetingsDto, user)
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-meetings")
  countMeetings(@Query() researchParamsMeetingsDto: ResearchParamsMeetingsDto, @CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countMeetings(researchParamsMeetingsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-everyone")
  countAllForEveryone(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countAllForEveryOne();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countAllByWeeksForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateMeetingDto: UpdateMeetingDto, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.update(id, updateMeetingDto);
  }
  
  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-all")
  countWeeklyAll(@CurrentUser() user: ProjectManager) : Promise<{id: number, count: number}[]> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countWeeklyAll();
  }
}