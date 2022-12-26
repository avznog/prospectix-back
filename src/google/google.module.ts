import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplate } from 'src/mail-templates/entities/mail-template.entity';
import { MailTemplatesService } from 'src/mail-templates/mail-templates.service';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Google } from './entities/google.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [TypeOrmModule.forFeature([Google, MailTemplate, ProjectManager])],
  controllers: [GoogleController],
  providers: [GoogleService, MailTemplatesService]
})
export class GoogleModule {}
