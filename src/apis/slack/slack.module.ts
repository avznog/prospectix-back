import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallsService } from 'src/actions/calls/calls.service';
import { Call } from 'src/actions/calls/entities/call.entity';
import { MeetingsService } from 'src/actions/meetings/meetings.service';
import { Reminder } from 'src/actions/reminders/entities/reminder.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { Meeting } from 'src/actions/meetings/entities/meeting.entity';
import { GoogleService } from '../google/google.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { MailTemplatesService } from 'src/mails/mail-templates/mail-templates.service';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { SentryService } from '../sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Reminder, Call, Meeting, SecondaryActivity, PrimaryActivity, SearchParams, MailTemplate]), HttpModule],
  controllers: [SlackController],
  providers: [SlackService, CallsService, MeetingsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class SlackModule {}
