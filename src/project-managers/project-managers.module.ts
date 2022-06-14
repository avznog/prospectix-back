import { Module } from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { ProjectManagersController } from './project-managers.controller';

@Module({
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService],
})
export class ProjectManagersModule {}
