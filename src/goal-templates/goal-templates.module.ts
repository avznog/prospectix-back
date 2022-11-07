import { Module } from '@nestjs/common';
import { GoalTemplatesService } from './goal-templates.service';
import { GoalTemplatesController } from './goal-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalTemplate } from './entities/goal-template.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Goal } from 'src/goals/entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalTemplate, ProjectManager, Goal])],
  controllers: [GoalTemplatesController],
  providers: [GoalTemplatesService]
})
export class GoalTemplatesModule {}
