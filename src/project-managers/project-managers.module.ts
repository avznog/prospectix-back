import { Module } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { ProjectManagersController } from './project-managers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from './entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService]
})
export class ProjectManagersModule {}
