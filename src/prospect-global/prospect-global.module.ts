import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';
import { EmailsModule } from './emails/emails.module';
import { PhonesModule } from './phones/phones.module';
import { ProspectsModule } from './prospects/prospects.module';
import { WebsitesModule } from './websites/websites.module';

@Module({
  imports: [CountriesModule, EmailsModule, PhonesModule, ProspectsModule, WebsitesModule]
})
export class ProspectGlobalModule {}
