import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { Reminder } from './entities/reminder.entity';
import { ProspectsService } from 'src/prospects/prospects.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('reminders')
@ApiTags("reminders")
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
    private readonly pmService: ProjectManagersService,
    private readonly prospectService: ProspectsService
    ) {}

  @Post(":idProspect")
  async create(@Body() createReminderDto: CreateReminderDto, @Param("idProspect") idProspect: number) : Promise<Reminder>{
    const pm = await this.pmService.findByPayload()
    return await this.reminderService.create(pm.id, createReminderDto, idProspect);
  }

  @Get("by-pm")
  async findAllByPm() : Promise<Reminder[]>{
    const pm = await this.pmService.findByPayload();
    return await this.reminderService.findAllByPm(pm.id);
  }

  @Get("by-prospect/:idProspect")
  async findAllByProspect(@Param("idProspect") idProspect: number): Promise<Reminder[]> {
    return await this.reminderService.findAllByProspect(idProspect);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto ){
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderService.remove(+id);
  }
}
