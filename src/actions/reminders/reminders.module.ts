import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { SentryService } from '../../apis/sentry/sentry.service';
import { PrimaryActivity } from '../../prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { PrimaryActivityService } from '../../prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivity } from '../../prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SecondaryActivitiesService } from '../../prospect-global/activities/secondary-activities/secondary-activities.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Reminder, ProjectManager, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [RemindersController],
  providers: [RemindersService, SecondaryActivitiesService, PrimaryActivityService, SentryService]
})
export class RemindersModule {}
