import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { Event } from 'src/admin/events/entities/event.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { EventsService } from './events.service';


@UseInterceptors(SentryInterceptor)
@Controller('events')
@ApiTags("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly sentryService: SentryService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create")
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: ProjectManager) : Promise<Event> {
    this.sentryService.setSentryUser(user);
    return this.eventsService.create(createEventDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-by-prospect")
  findAllByProspect(@Query("prospectId") prospectId: number, @CurrentUser() user: ProjectManager) : Promise<Event[]> {
    this.sentryService.setSentryUser(user);
    return this.eventsService.findAllByProspect(prospectId);
  }
}
