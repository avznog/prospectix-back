import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleService } from 'src/google/google.service';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { MailTemplate } from './entities/mail-template.entity';
import { MailTemplatesController } from './mail-templates.controller';
import { MailTemplatesService } from './mail-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([MailTemplate, ProjectManager])],
  controllers: [MailTemplatesController],
  providers: [MailTemplatesService, GoogleService]
})
export class MailTemplatesModule {}
