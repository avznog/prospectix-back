import { Module } from '@nestjs/common';
import { GoalTemplatesService } from './goal-templates.service';
import { GoalTemplatesController } from './goal-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalTemplate } from './entities/goal-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalTemplate])],
  controllers: [GoalTemplatesController],
  providers: [GoalTemplatesService]
})
export class GoalTemplatesModule {}
