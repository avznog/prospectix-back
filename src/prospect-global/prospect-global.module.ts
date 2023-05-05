import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';
import { EmailsModule } from './emails/emails.module';
import { PhonesModule } from './phones/phones.module';
import { ProspectsModule } from './prospects/prospects.module';
import { WebsitesModule } from './websites/websites.module';
import { ActivitiesModule } from './activities/activities.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [ActivitiesModule, CitiesModule, CountriesModule, EmailsModule, PhonesModule, ProspectsModule, WebsitesModule]
})
export class ProspectGlobalModule {}
