import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { UpdateResult } from 'typeorm';

@Controller('meetings')
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly pmService: ProjectManagersService
    ) {}

  @Post(":idProspect")
  async create(@Body() createMeetingDto: CreateMeetingDto, @Param("idProspect") idProspect: number) : Promise<Meeting> {
    const pm = await this.pmService.findByPayload()
    return await this.meetingsService.create(createMeetingDto, pm.id, idProspect);
  }

  @Get("by-pm")
  async findAllByPm() : Promise<Meeting[]>{
    const pm = await this.pmService.findByPayload();
    return await this.meetingsService.findAllByPm(pm.id);
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
