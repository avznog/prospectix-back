import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { RolesType } from 'src/auth/role.type';

@Controller('events')
@ApiTags("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post("create")
  create(@Body() createEventDto: CreateEventDto) : Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-by-prospect")
  findAllByProspect(@Query("prospectId") prospectId: number) : Promise<Event[]> {
    return this.eventsService.findAllByProspect(prospectId);
  }
}
