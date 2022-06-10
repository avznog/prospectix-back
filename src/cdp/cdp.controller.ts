import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CdpService } from './cdp.service';
import { CreateCdpDto } from './dto/create-cdp.dto';
import { UpdateCdpDto } from './dto/update-cdp.dto';

@Controller('cdp')
export class CdpController {
  constructor(private readonly cdpService: CdpService) {}

  @Post()
  create(@Body() createCdpDto: CreateCdpDto) {
    return this.cdpService.create(createCdpDto);
  }

  @Get()
  findAll() {
    return this.cdpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cdpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCdpDto: UpdateCdpDto) {
    return this.cdpService.update(+id, updateCdpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cdpService.remove(+id);
  }
}
