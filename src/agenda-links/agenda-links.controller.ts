import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgendaLinksService } from './agenda-links.service';
import { CreateAgendaLinkDto } from './dto/create-agenda-link.dto';
import { UpdateAgendaLinkDto } from './dto/update-agenda-link.dto';

@Controller('agenda-links')
export class AgendaLinksController {
  constructor(private readonly agendaLinksService: AgendaLinksService) {}

  @Post()
  create(@Body() createAgendaLinkDto: CreateAgendaLinkDto) {
    return this.agendaLinksService.create(createAgendaLinkDto);
  }

  @Get()
  findAll() {
    return this.agendaLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaLinksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendaLinkDto: UpdateAgendaLinkDto) {
    return this.agendaLinksService.update(+id, updateAgendaLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaLinksService.remove(+id);
  }
}
