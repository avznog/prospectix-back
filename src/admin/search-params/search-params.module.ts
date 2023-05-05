import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchParams } from './entities/search-params.entity';
import { SearchParamsController } from './search-params.controller';
import { SearchParamsService } from './search-params.service';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchParams])],
  controllers: [SearchParamsController],
  providers: [SearchParamsService, SentryService]
})
export class SearchParamsModule {}
