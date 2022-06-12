import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('prospects')
@ApiTags('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  // @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createProspectDto: CreateProspectDto) {
    return this.prospectsService.create(createProspectDto);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.prospectsService.findAll();
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prospectsService.findOne(+id);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProspectDto: UpdateProspectDto,
  ) {
    return this.prospectsService.update(+id, updateProspectDto);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prospectsService.remove(+id);
  }
}
