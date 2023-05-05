import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Call, ProjectManager])],
  controllers: [CallsController],
  providers: [CallsService, SentryService]
})
export class CallsModule {}
