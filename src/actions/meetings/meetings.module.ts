import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { GoogleModule } from '../../apis/google/google.module';
import { GoogleService } from '../../apis/google/google.service';
import { SentryService } from '../../apis/sentry/sentry.service';
import { MailTemplate } from '../../mails/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from '../../mails/mail-templates/mail-templates.service';
import { PrimaryActivity } from '../../prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { PrimaryActivityService } from '../../prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivity } from '../../prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SecondaryActivitiesService } from '../../prospect-global/activities/secondary-activities/secondary-activities.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, ProjectManager, SecondaryActivity, PrimaryActivity, SearchParams, MailTemplate]), GoogleModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class MeetingsModule {}
