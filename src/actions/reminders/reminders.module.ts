import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, ProjectManager, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [RemindersController],
  providers: [RemindersService, SecondaryActivitiesService, PrimaryActivityService, SentryService]
})
export class RemindersModule {}
