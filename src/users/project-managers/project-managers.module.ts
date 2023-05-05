import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from './entities/project-manager.entity';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManagersService } from './project-managers.service';
import { Reminder } from 'src/actions/reminders/entities/reminder.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import { Call } from 'src/actions/calls/entities/call.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService, SentryService]
})
export class ProjectManagersModule {}
