import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegativeAnswer } from './entities/negative-answer.entity';
import { NegativeAnswersController } from './negative-answers.controller';
import { NegativeAnswersService } from './negative-answers.service';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { SentryService } from '../../apis/sentry/sentry.service';
import { PrimaryActivity } from '../../prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { PrimaryActivityService } from '../../prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivity } from '../../prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { SecondaryActivitiesService } from '../../prospect-global/activities/secondary-activities/secondary-activities.service';

@Module({
  imports: [TypeOrmModule.forFeature([NegativeAnswer, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [NegativeAnswersController],
  providers: [NegativeAnswersService, SecondaryActivitiesService, PrimaryActivityService, SentryService]
})
export class NegativeAnswersModule {}
