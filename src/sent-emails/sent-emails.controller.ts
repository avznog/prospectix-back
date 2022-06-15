import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { UpdateSentEmailDto } from './dto/update-sent-email.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('sent-emails')
@ApiTags("sent-emails")
export class SentEmailsController {
  constructor(private readonly sentEmailsService: SentEmailsService) {}

  @Post()
  create(@Body() createSentEmailDto: CreateSentEmailDto) {
    return this.sentEmailsService.create(createSentEmailDto);
  }

  @Get()
  findAll() {
    return this.sentEmailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentEmailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSentEmailDto: UpdateSentEmailDto) {
    return this.sentEmailsService.update(+id, updateSentEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentEmailsService.remove(+id);
  }
}
