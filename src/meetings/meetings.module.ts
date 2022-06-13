import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProspectsService } from 'src/prospects/prospects.service';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Prospect, ProjectManager])],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingsService, ProspectsService, ProjectManagersService]
})
export class MeetingsModule {}
