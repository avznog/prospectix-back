import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { ResearchParamsRemindersDto } from './dto/research-params-reminders.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { RemindersService } from './reminders.service';
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
  @Patch("/:id")
  update(@Param("id") id: number, @Body() updateReminderDto: UpdateReminderDto){
    return this.reminderService.update(id, updateReminderDto)
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
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsRemindersDto: ResearchParamsRemindersDto, @CurrentUser() user) : Promise<Reminder[]> {
    return this.reminderService.findAllPaginated(researchParamsRemindersDto, user);
  }
}
