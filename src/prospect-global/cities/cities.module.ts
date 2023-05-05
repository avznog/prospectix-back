import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { SearchParams } from 'src/admin/search-params/entities/search-params.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';


@Module({
  imports: [TypeOrmModule.forFeature([City, SearchParams])],
  controllers: [CitiesController],
  providers: [CitiesService, SentryService]
})
export class CitiesModule {}
