import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from 'src/calls/entities/call.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ProjectManager, Call, Meeting, Reminder])],
  controllers: [SlackController],
  providers: [SlackService]
})
export class SlackModule {}
