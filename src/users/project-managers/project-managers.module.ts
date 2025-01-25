import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManager } from './entities/project-manager.entity';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManagersService } from './project-managers.service';
import { SentryService } from '../../apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService, SentryService]
})
export class ProjectManagersModule {}
