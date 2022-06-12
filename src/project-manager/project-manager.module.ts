import { Module } from '@nestjs/common';
import { ProjectManagerService } from './project-manager.service';
import { ProjectManagerController } from './project-manager.controller';
import { ProjectManager } from './entities/project-manager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagerController],
  providers: [ProjectManagerService],
})
export class ProjectManagerModule {}
