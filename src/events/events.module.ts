import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Prospect, ProjectManager])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
