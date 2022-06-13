import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { Reminder } from './entities/reminder.entity';
import { ProspectsService } from 'src/prospects/prospects.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';

@Controller('reminders')
@ApiTags("reminders")
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
    ) {}

  @Post(":idProspect")
  async create(@Body() createReminderDto: CreateReminderDto, @Param("idProspect") idProspect: number) : Promise<Reminder>{
    // const pm = await this.pmService.findByPayload()
    // return await this.reminderService.create(pm.id, createReminderDto, idProspect);
    return await this.reminderService.create(0, createReminderDto, idProspect);

  }

  @Get("by-pm")
  async findAllByPm() : Promise<Reminder[]>{
    // const pm = await this.authService.validatePm()
    // return await this.reminderService.findAllByPm(pm.id);
    return await this.reminderService.findAllByPm(0);
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
