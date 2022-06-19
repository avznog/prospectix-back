import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';

@Controller('meetings')
@ApiTags("meetings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService
    ) {}

  @Roles("Cdp", "Admin")
  @Post(":idProspect")
  create(@Body() createMeetingDto: CreateMeetingDto, @Param("idProspect") idProspect: number, @Req() request: RequestWithPm) : Promise<Meeting> {
    request.pm = request.user as ProjectManager;
    return this.meetingsService.create(createMeetingDto, request.pm.id, idProspect);
  }

  @Get("by-pm")
  @Roles("Cdp","Admin")
  findAllByPm(@Req() request: RequestWithPm) : Promise<Meeting[]>{
    request.pm = request.user as ProjectManager;
    return this.meetingsService.findAllByPm(request.pm.id);
  }

  @Get("by-prospect/:idProspect")
  @Roles("Cdp","Admin")
  findAllByProspect(@Param("idProspect") idProspect: number) : Promise<Meeting[]> {
    return this.meetingsService.findAllByProspect(idProspect);
  }
}
