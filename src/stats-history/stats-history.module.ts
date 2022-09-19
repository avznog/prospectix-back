import { Module } from '@nestjs/common';
import { StatsHistoryService } from './stats-history.service';
import { StatsHistoryController } from './stats-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsHistory } from './entities/stats-history.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatsHistory, ProjectManager])],
  controllers: [StatsHistoryController],
  providers: [StatsHistoryService]
})
export class StatsHistoryModule {}