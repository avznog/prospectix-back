import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete, Query } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { RolesType } from 'src/auth/role.type';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ResearchParamsMeetingsDto } from './dto/research-parmas-meetings.dto';

@Controller('meetings')
@ApiTags("meetings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService
    ) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get()
  findAll() : Promise<Meeting[]> {
    return this.meetingsService.findAll();
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto, @CurrentUser() user) : Promise<Meeting> {
    return this.meetingsService.create(createMeetingDto, user);
  }

  @Get("by-current-pm")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllByCurrentPm(@CurrentUser() user) : Promise<Meeting[]>{
    return this.meetingsService.findAllByCurrentPm(user.id);
  }

  @Get("by-prospect/:idProspect")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllByProspect(@Param("idProspect") idProspect: number) : Promise<Meeting[]> {
    return this.meetingsService.findAllByProspect(idProspect);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("delete/:id")
  delete(@Param("id") idMeeting: number) : Promise<DeleteResult> {
    return this.meetingsService.delete(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-done/:id")
  markDone(@Param("id") idMeeting: number) : Promise<UpdateResult> {
    return this.meetingsService.markDone(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("mark-undone/:id")
  markUndone(@Param("id") idMeeting: number) : Promise<UpdateResult> {
    return this.meetingsService.markUndone(idMeeting);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsMeetingsDto: ResearchParamsMeetingsDto) : Promise<Meeting[]> {  
    return this.meetingsService.findAllPaginated(researchParamsMeetingsDto);
  }
}
