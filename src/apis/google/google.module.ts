import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplate } from 'src/mails/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from 'src/mails/mail-templates/mail-templates.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { ProjectManagersModule } from 'src/users/project-managers/project-managers.module';
import { SentryService } from '../sentry/sentry.service';

@Module({
  imports: [ProjectManagersModule, TypeOrmModule.forFeature([ProjectManager, MailTemplate])],
  controllers: [GoogleController],
  providers: [GoogleService, MailTemplatesService, SentryService]
})
export class GoogleModule {}
