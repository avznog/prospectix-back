import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalTemplate } from './entities/goal-template.entity';
import { GoalTemplatesController } from './goal-templates.controller';
import { GoalTemplatesService } from './goal-templates.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Goal } from '../goals/entities/goal.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoalTemplate, ProjectManager, Goal, GoalTemplate])],
  controllers: [GoalTemplatesController],
  providers: [GoalTemplatesService, SentryService]
})
export class GoalTemplatesModule {}
