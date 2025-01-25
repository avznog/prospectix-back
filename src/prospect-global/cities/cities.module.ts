import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { SentryService } from '../../apis/sentry/sentry.service';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, SearchParams])],
  controllers: [CitiesController],
  providers: [CitiesService, SentryService]
})
export class CitiesModule {}
