import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prospect } from './entities/prospect.entity';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from './prospects.service';
import { SecondaryActivity } from '../activities/secondary-activities/entities/secondary-activity.entity';
import { City } from '../cities/entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { SearchParams } from '../../admin/search-params/entities/search-params.entity';
import { SentryService } from '../../apis/sentry/sentry.service';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { Email } from '../emails/entities/email.entity';
import { Phone } from '../phones/entities/phone.entity';
import { Website } from '../websites/entities/website.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prospect, SecondaryActivity, City, Country, ProjectManager, Event, Phone, Website, Email, SearchParams])],
  controllers: [ProspectsController],
  providers: [ProspectsService, SentryService]
})
export class ProspectsModule {}
