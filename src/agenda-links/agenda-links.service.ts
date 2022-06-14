import { Injectable } from '@nestjs/common';
import { CreateAgendaLinkDto } from './dto/create-agenda-link.dto';
import { UpdateAgendaLinkDto } from './dto/update-agenda-link.dto';

@Injectable()
export class AgendaLinksService {
  create(createAgendaLinkDto: CreateAgendaLinkDto) {
    return 'This action adds a new agendaLink';
  }

  findAll() {
    return `This action returns all agendaLinks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agendaLink`;
  }

  update(id: number, updateAgendaLinkDto: UpdateAgendaLinkDto) {
    return `This action updates a #${id} agendaLink`;
  }

  remove(id: number) {
    return `This action removes a #${id} agendaLink`;
  }
}
