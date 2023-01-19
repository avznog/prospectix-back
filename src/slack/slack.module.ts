import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallsService } from 'src/calls/calls.service';
import { Call } from 'src/calls/entities/call.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { MeetingsService } from 'src/meetings/meetings.service';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ProjectManager, Call, Meeting, Reminder])],
  controllers: [SlackController],
  providers: [SlackService, CallsService, MeetingsService, ProjectManagersService]
})
export class SlackModule {}
