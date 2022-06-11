import { Module } from '@nestjs/common';
import { AgendaLinksService } from './agenda-links.service';
import { AgendaLinksController } from './agenda-links.controller';

@Module({
  controllers: [AgendaLinksController],
  providers: [AgendaLinksService]
})
export class AgendaLinksModule {}
