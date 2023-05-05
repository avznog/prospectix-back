import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalTemplate } from '../goal-templates/entities/goal-template.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, GoalTemplate, ProjectManager, SearchParams])],
  controllers: [GoalsController],
  providers: [GoalsService, SentryService]
})
export class GoalsModule {}
