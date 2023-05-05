import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrimaryActivity } from './entities/primary-activity.entity';
import { PrimaryActivityController } from './primary-activity.controller';
import { PrimaryActivityService } from './primary-activity.service';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrimaryActivity, SearchParams])],
  controllers: [PrimaryActivityController],
  providers: [PrimaryActivityService, SentryService]
})
export class PrimaryActivitiesModule {}
