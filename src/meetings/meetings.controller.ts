import { Controller, Get, Post, Body, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('meetings')
@ApiTags("meetings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService
    ) {}

  @Roles("Cdp","Admin")
  @Get()
  findAll() : Promise<Meeting[]> {
    return this.meetingsService.findAll();
  }

  @Roles("Cdp", "Admin")
  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto) : Promise<Meeting> {
    return this.meetingsService.create(createMeetingDto);
  }

  @Get("by-current-pm")
  @Roles("Cdp","Admin")
  findAllByCurrentPm(@Req() request: RequestWithPm) : Promise<Meeting[]>{
    request.pm = request.user as ProjectManager;
    return this.meetingsService.findAllByCurrentPm(request.pm.id);
  }

  @Get("by-prospect/:idProspect")
  @Roles("Cdp","Admin")
  findAllByProspect(@Param("idProspect") idProspect: number) : Promise<Meeting[]> {
    return this.meetingsService.findAllByProspect(idProspect);
  }

  @Roles("Cdp","Admin")
  @Delete("delete/:id")
  delete(@Param("id") idMeeting: number) : Promise<DeleteResult> {
    return this.meetingsService.delete(idMeeting);
  }

  @Roles("Cdp","Admin")
  @Get("mark-done/:id")
  markDone(@Param("id") idMeeting: number) : Promise<UpdateResult> {
    return this.meetingsService.markDone(idMeeting);
  }

  @Roles("Cdp","Admin")
  @Get("mark-undone/:id")
  markUndone(@Param("id") idMeeting: number) : Promise<UpdateResult> {
    return this.meetingsService.markUndone(idMeeting);
  }

  @Roles("Cdp","Admin")
  @Get("by-keyword/:keyword")
  findAllByKeyword(@Param("keyword") keyword: string) : Promise<Meeting[]> {
    return this.meetingsService.findAllByKeyword(keyword);
  }
}
