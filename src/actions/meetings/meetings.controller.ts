import { UseInterceptors, Controller, UseGuards, Post, Body, Delete, Param, Get, Query, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { SentryService } from "../../apis/sentry/sentry.service";
import { Roles } from "../../auth/annotations/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.model";
import JwtAuthGuard from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { RolesType } from "../../auth/role.type";
import { SentryInterceptor } from "../../sentry.interceptor";
import { ProjectManager } from "../../users/project-managers/entities/project-manager.entity";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { ResearchParamsMeetingsDto } from "./dto/research-params-meetings.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { Meeting } from "./entities/meeting.entity";
import { MeetingsService } from "./meetings.service";


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
  findAllPaginated(@Query() researchParamsMeetingsDto: ResearchParamsMeetingsDto, @CurrentUser() user: ProjectManager) : Promise<{meetings: Meeting[], count: number}> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.findAllPaginated(researchParamsMeetingsDto, user);
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

  @Roles(RolesType.ADMIN)
  @Get("count-meetings-for-week-all-pm")
  countMeetingsForWeekAllPm(@CurrentUser() user: ProjectManager, @Query() interval: { dateDown: Date, dateUp: Date }) : Promise<{id: number, count: number}[]> {
    this.sentryService.setSentryUser(user);
    return this.meetingsService.countMeetingsForWeekAllPm(interval);
  }
}
