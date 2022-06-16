import { PartialType } from '@nestjs/swagger';
import { CreateAgendaLinkDto } from './create-agenda-link.dto';

export class UpdateAgendaLinkDto extends PartialType(CreateAgendaLinkDto) {}
