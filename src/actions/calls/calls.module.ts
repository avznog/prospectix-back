import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { SentryService } from '../../apis/sentry/sentry.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call, ProjectManager])],
  controllers: [CallsController],
  providers: [CallsService, SentryService]
})
export class CallsModule {}
