import { Module } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManager } from './entities/project-manager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService],
})
export class ProjectManagersModule {}
