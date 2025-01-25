import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentEmail } from './entities/sent-email.entity';
import { SentEmailsController } from './sent-emails.controller';
import { SentEmailsService } from './sent-emails.service';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { GoogleService } from '../../apis/google/google.service';
import { SentryService } from '../../apis/sentry/sentry.service';
import { MailTemplate } from '../../mails/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from '../../mails/mail-templates/mail-templates.service';
import { PrimaryActivity } from '../../prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { PrimaryActivityService } from '../../prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivity } from '../../prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SecondaryActivitiesService } from '../../prospect-global/activities/secondary-activities/secondary-activities.service';
import { Prospect } from '../../prospect-global/prospects/entities/prospect.entity';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentEmail, ProjectManager, Prospect, MailTemplate, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [SentEmailsController],
  providers: [SentEmailsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class SentEmailsModule {}
