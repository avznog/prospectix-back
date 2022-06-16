import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('events')
@ApiTags("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
}
