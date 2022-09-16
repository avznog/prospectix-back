import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Statistic } from './entities/statistic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistic, ProjectManager])],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}
