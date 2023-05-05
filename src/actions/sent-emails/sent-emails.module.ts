import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentEmail } from './entities/sent-email.entity';
import { SentEmailsController } from './sent-emails.controller';
import { SentEmailsService } from './sent-emails.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { GoogleService } from 'src/apis/google/google.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { MailTemplatesService } from 'src/mails/mail-templates/mail-templates.service';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([SentEmail, ProjectManager, Prospect, MailTemplate, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [SentEmailsController],
  providers: [SentEmailsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class SentEmailsModule {}
