import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
@ApiTags("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Roles("Cdp","Admin")
  @Post("create")
  create(@Body() createEventDto: CreateEventDto) : Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Roles("Cdp","Admin")
  @Get("find-all-by-prospect")
  findAllByProspect(@Query("prospectId") prospectId: number) : Promise<Event[]> {
    return this.eventsService.findAllByProspect(prospectId);
  }
}
