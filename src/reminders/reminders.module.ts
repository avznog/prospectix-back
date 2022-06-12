import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { TypeOrmModule} from "@nestjs/typeorm";
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { ProspectsService } from 'src/prospects/prospects.service';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, ProjectManager, Prospect])],
  controllers: [RemindersController],
  providers: [RemindersService, ProjectManagersService, ProspectsService]
})
export class RemindersModule {}
