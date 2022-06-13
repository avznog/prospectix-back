import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';

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

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.update(+id, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(+id);
  }
}
