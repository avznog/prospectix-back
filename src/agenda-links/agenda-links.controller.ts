import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { AgendaLinksService } from './agenda-links.service';

@UseInterceptors(SentryInterceptor)
@Controller('agenda-links')
@ApiTags("agenda-links")
export class AgendaLinksController {
  constructor(private readonly agendaLinksService: AgendaLinksService) {}
}
