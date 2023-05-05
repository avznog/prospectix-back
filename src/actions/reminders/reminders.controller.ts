import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateReminderDto } from 'src/actions/reminders/dto/create-reminder.dto';
import { Reminder } from 'src/actions/reminders/entities/reminder.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ResearchParamsRemindersDto } from './dto/research-params-reminders.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@UseInterceptors(SentryInterceptor)
@Controller('reminders')
@ApiTags("reminders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
    private readonly sentryService: SentryService
  ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createReminderDto: CreateReminderDto, @CurrentUser() user) : Promise<Reminder>{
    this.sentryService.setSentryUser(user);
    return this.reminderService.create(createReminderDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch("/:id")
  update(@Param("id") id: number, @Body() updateReminderDto: UpdateReminderDto, @CurrentUser() user: ProjectManager){
    this.sentryService.setSentryUser(user);
    return this.reminderService.update(id, updateReminderDto)
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-prospect/:idProspect")
  findAllByProspect(@Param("idProspect") idProspect: number, @CurrentUser() user: ProjectManager): Promise<Reminder[]> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.findAllByProspect(idProspect);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("delete/:id")
  delete(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<DeleteResult> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.delete(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-done/:id")
  markDone(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<UpdateResult> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.markDone(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsRemindersDto: ResearchParamsRemindersDto, @CurrentUser() user: ProjectManager) : Promise<{reminders: Reminder[], count: number}> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.findAllPaginated(researchParamsRemindersDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.reminderService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.reminderService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.reminderService.countAllByWeeksForMe(user);
  }
}