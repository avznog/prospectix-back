import { Module } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { SentEmailsController } from './sent-emails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentEmail } from './entities/sent-email.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentEmail, ProjectManager, Prospect])],
  controllers: [SentEmailsController],
  providers: [SentEmailsService]
})
export class SentEmailsModule {}
