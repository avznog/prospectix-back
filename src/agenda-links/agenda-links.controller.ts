import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgendaLinksService } from './agenda-links.service';

@Controller('agenda-links')
@ApiTags("agenda-links")
export class AgendaLinksController {
  constructor(private readonly agendaLinksService: AgendaLinksService) {}
}
