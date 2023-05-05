import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { SearchParamsModule } from './search-params/search-params.module';

@Module({
  imports: [EventsModule, SearchParamsModule]
})
export class AdminModule {}
