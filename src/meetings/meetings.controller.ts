import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { UpdateResult } from 'typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import RequestWithPm from 'src/auth/interfaces/requestWithPm.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('meetings')
@ApiTags("meetings")
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService
    ) {}

  @Post(":idProspect")
  async create(@Body() createMeetingDto: CreateMeetingDto, @Param("idProspect") idProspect: number, @Req() request: RequestWithPm) : Promise<Meeting> {
    request.pm = request.user as ProjectManager;
    return await this.meetingsService.create(createMeetingDto, request.pm.id, idProspect);
  }

  @Get("by-pm")
  async findAllByPm(@Req() request: RequestWithPm) : Promise<Meeting[]>{
    request.pm = request.user as ProjectManager;
    return await this.meetingsService.findAllByPm(request.pm.id);
  }

  @Get("by-prospect/:idProspect")
  async findAllByProspect(@Param("idProspect") idProspect: number) : Promise<Meeting[]> {
    return await this.meetingsService.findAllByProspect(idProspect);
  }

  @Patch(':idMeeting')
  async update(@Param('idMeeting') idMeeting: string, @Body() updateMeetingDto: UpdateMeetingDto) : Promise<UpdateResult>{
    return await this.meetingsService.update(+idMeeting, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(+id);
  }
}
