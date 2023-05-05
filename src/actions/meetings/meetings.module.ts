import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { GoogleService } from 'src/apis/google/google.service';
import { GoogleModule } from 'src/apis/google/google.module';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { MailTemplatesService } from 'src/mails/mail-templates/mail-templates.service';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, ProjectManager, SecondaryActivity, PrimaryActivity, SearchParams, MailTemplate]), GoogleModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class MeetingsModule {}
