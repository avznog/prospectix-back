import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecondaryActivity } from './entities/secondary-activity.entity';
import { SecondaryActivitiesService } from './secondary-activities.service';
import { SecondaryActivitiesController } from './secondary-activities.controller';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecondaryActivity])],
  controllers: [SecondaryActivitiesController],
  providers: [SecondaryActivitiesService, SentryService]
})
export class SecondaryActivitiesModule {}
