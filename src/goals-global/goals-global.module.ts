import { Module } from '@nestjs/common';
import { GoalTemplatesModule } from './goal-templates/goal-templates.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [GoalTemplatesModule, GoalsModule]
})
export class GoalsGlobalModule {}
