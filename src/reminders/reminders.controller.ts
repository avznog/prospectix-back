import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { ApiTags } from '@nestjs/swagger';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult } from 'typeorm';
@Controller('reminders')
@ApiTags("reminders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
    ) {}

  @Roles("Cdp","Admin")
  @Post(":idProspect")
  create(@Body() createReminderDto: CreateReminderDto, @Param("idProspect") idProspect: number, @Req() request: RequestWithPm) : Promise<Reminder>{
    request.pm = request.user as ProjectManager;
    return this.reminderService.create(request.pm.id, createReminderDto, idProspect);

  }

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Reminder[]> {
    return this.reminderService.findAll();
  }

  @Roles("Cdp","Admin")
  @Get("by-current-pm")
  findAllByCurrentPm(@Req() request: RequestWithPm) : Promise<Reminder[]>{
    request.pm = request.user as ProjectManager;
    return this.reminderService.findAllByCurrentPm(request.pm.id);
  }

  @Roles("Cdp","Admin")
  @Get("by-pm/:pseudoPm")
  findAllByPm(@Param("pseudoPm") pseudoPm: string) : Promise<Reminder[]> {
    return this.reminderService.findAllByPm(pseudoPm);
  }

  @Roles("Cdp","Admin")
  @Get("by-prospect/:idProspect")
  findAllByProspect(@Param("idProspect") idProspect: number): Promise<Reminder[]> {
    return this.reminderService.findAllByProspect(idProspect);
  }

  @Roles("Cdp","Admin")
  @Delete("delete/:id")
  delete(@Param("id") id: number) : Promise<DeleteResult> {
    return this.reminderService.delete(id);
  }

}
