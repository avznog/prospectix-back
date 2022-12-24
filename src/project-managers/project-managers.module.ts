import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from 'src/calls/entities/call.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { ProjectManager } from './entities/project-manager.entity';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManagersService } from './project-managers.service';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Reminder, Prospect, Call])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService],
})
export class ProjectManagersModule {}
