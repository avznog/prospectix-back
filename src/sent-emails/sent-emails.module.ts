import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleService } from 'src/google/google.service';
import { MailTemplate } from 'src/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from 'src/mail-templates/mail-templates.service';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { SentEmail } from './entities/sent-email.entity';
import { SentEmailsController } from './sent-emails.controller';
import { SentEmailsService } from './sent-emails.service';

@Module({
  imports: [TypeOrmModule.forFeature([SentEmail, ProjectManager, Prospect, MailTemplate])],
  controllers: [SentEmailsController],
  providers: [SentEmailsService, GoogleService, MailTemplatesService]
})
export class SentEmailsModule {}
