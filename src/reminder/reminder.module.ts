import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule} from "@nestjs/typeorm";
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-manager/entities/project-manager.entity';
import { ProjectManagerService } from 'src/project-manager/project-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, ProjectManager])],
  controllers: [ReminderController],
  providers: [ReminderService, ProjectManagerService]
})
export class ReminderModule {}
