import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call, ProjectManager, Prospect])],
  controllers: [CallsController],
  providers: [CallsService]
})
export class CallsModule {}
