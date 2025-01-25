import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplate } from '../../mails/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from '../../mails/mail-templates/mail-templates.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { ProjectManagersModule } from '../../users/project-managers/project-managers.module';
import { SentryService } from '../sentry/sentry.service';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [ProjectManagersModule, TypeOrmModule.forFeature([ProjectManager, MailTemplate])],
  controllers: [GoogleController],
  providers: [GoogleService, MailTemplatesService, SentryService]
})
export class GoogleModule {}
