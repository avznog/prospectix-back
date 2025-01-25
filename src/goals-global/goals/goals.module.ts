import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalTemplate } from '../goal-templates/entities/goal-template.entity';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { SentryService } from '../../apis/sentry/sentry.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, GoalTemplate, ProjectManager, SearchParams])],
  controllers: [GoalsController],
  providers: [GoalsService, SentryService]
})
export class GoalsModule {}
