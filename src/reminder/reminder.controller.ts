import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ProjectManagerService } from 'src/project-manager/project-manager.service';
import { Reminder } from './entities/reminder.entity';

@Controller('reminder')
export class ReminderController {
  constructor(
    private readonly reminderService: ReminderService,
    private readonly pmService: ProjectManagerService
    ) {}

  @Post()
  async create(@Body() createReminderDto: CreateReminderDto) : Promise<Reminder>{
    const pm = await this.pmService.findByPayload()
    return await this.reminderService.create(pm.id, createReminderDto);
  }

  @Get()
  async findAllFromPm() : Promise<Reminder[]>{
    const pm = await this.pmService.findByPayload();
    return await this.reminderService.findAllFromPm(pm.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.reminderService.update(+id, updateReminderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderService.remove(+id);
  }
}
