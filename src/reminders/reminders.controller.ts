import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete, Query } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { ApiTags } from '@nestjs/swagger';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Controller('reminders')
@ApiTags("reminders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
    ) {}

  @Roles("Cdp","Admin")
  @Post()
  create(@Body() createReminderDto: CreateReminderDto) : Promise<Reminder>{
    return this.reminderService.create(createReminderDto);
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

  @Roles("Cdp","Admin")
  @Get("mark-done/:id")
  markDone(@Param("id") id: number) : Promise<UpdateResult> {
    return this.reminderService.markDone(id);
  }

  @Roles("Cdp","Admin")
  @Get("mark-undone/:id")
  markUndone(@Param("id") id: number) : Promise<UpdateResult> {
    return this.reminderService.markUnDone(id);
  }

  @Roles("Cdp","Admin")
  @Get("find-all-paginated")
  findAllPaginated(

    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("priority") priority: number,
    @Query("orderByPriority") orderByPriority: string,
    @Query("done") done: string,
    @Query("date") date: string,
    @Query("oldOrNew") oldOrNew: string,
    @Query("keyword") keyword: string

    ) : Promise<Reminder[]> {
    return this.reminderService.findAllPaginated(take, skip, priority, orderByPriority, done, date, oldOrNew, keyword);
  }
}
