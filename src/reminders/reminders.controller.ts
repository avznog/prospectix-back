import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { ApiTags } from '@nestjs/swagger';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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
  @Get("by-pm")
  findAllByPm(@Req() request: RequestWithPm) : Promise<Reminder[]>{
    request.pm = request.user as ProjectManager;
    return this.reminderService.findAllByPm(request.pm.id);
  }

  @Roles("Cdp","Admin")
  @Get("by-prospect/:idProspect")
  findAllByProspect(@Param("idProspect") idProspect: number): Promise<Reminder[]> {
    return this.reminderService.findAllByProspect(idProspect);
  }

}
