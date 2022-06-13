import { Module } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospect } from './entities/prospect.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prospect, Reminder, ProjectManager])],
  controllers: [ProspectsController],
  providers: [ProspectsService]
})
export class ProspectsModule {}
