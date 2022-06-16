import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, ProjectManager])],
  controllers: [GoalsController],
  providers: [GoalsService]
})
export class GoalsModule {}
