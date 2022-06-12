import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';

@Controller('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Post()
  create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.create(createProspectDto);
  }

  @Get()
  findAll() {
    return this.prospectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prospectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProspectDto: UpdateProspectDto) {
    return this.prospectsService.update(+id, updateProspectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prospectsService.remove(+id);
  }
}
