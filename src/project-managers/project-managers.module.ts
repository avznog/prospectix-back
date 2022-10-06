import { Module } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManager } from './entities/project-manager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Call } from 'src/calls/entities/call.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Reminder, Prospect, Call])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService],
})
export class ProjectManagersModule {}
