import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Website])],
  controllers: [WebsitesController],
  providers: [WebsitesService, SentryService]
})
export class WebsitesModule {}
