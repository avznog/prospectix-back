import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegativeAnswer } from './entities/negative-answer.entity';
import { NegativeAnswersController } from './negative-answers.controller';
import { NegativeAnswersService } from './negative-answers.service';
import { SecondaryActivitiesService } from 'src/prospect-global/activities/secondary-activities/secondary-activities.service';
import { PrimaryActivityService } from 'src/prospect-global/activities/primary-activities/primary-activity.service';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { PrimaryActivity } from 'src/prospect-global/activities/primary-activities/entities/primary-activity.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([NegativeAnswer, SecondaryActivity, PrimaryActivity, SearchParams])],
  controllers: [NegativeAnswersController],
  providers: [NegativeAnswersService, SecondaryActivitiesService, PrimaryActivityService, SentryService]
})
export class NegativeAnswersModule {}
