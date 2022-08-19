import { Controller, Get, Post, Body, Param, UseGuards, Delete, Query } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ResearchParamsRemindersDto } from './dto/research-params-reminders.dto';
@Controller('reminders')
@ApiTags("reminders")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(
    private readonly reminderService: RemindersService,
  ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createReminderDto: CreateReminderDto, @CurrentUser() user) : Promise<Reminder>{
    return this.reminderService.create(createReminderDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<Reminder[]> {
    return this.reminderService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-current-pm")
  findAllByCurrentPm(@CurrentUser() user) : Promise<Reminder[]>{
    return this.reminderService.findAllByCurrentPm(user.id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-pm/:pseudoPm")
  findAllByPm(@Param("pseudoPm") pseudoPm: string) : Promise<Reminder[]> {
    return this.reminderService.findAllByPm(pseudoPm);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("by-prospect/:idProspect")
  findAllByProspect(@Param("idProspect") idProspect: number): Promise<Reminder[]> {
    return this.reminderService.findAllByProspect(idProspect);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("delete/:id")
  delete(@Param("id") id: number) : Promise<DeleteResult> {
    return this.reminderService.delete(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-done/:id")
  markDone(@Param("id") id: number) : Promise<UpdateResult> {
    return this.reminderService.markDone(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-undone/:id")
  markUndone(@Param("id") id: number) : Promise<UpdateResult> {
    return this.reminderService.markUnDone(id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsRemindersDto: ResearchParamsRemindersDto) : Promise<Reminder[]> {
    return this.reminderService.findAllPaginated(researchParamsRemindersDto);
  }
}
