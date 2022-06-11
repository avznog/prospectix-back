import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivitiesModule } from './activities/activities.module';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { MeetingsModule } from './meetings/meetings.module';
import { WebsitesModule } from './websites/websites.module';
import { PhonesModule } from './phones/phones.module';
import { EmailsModule } from './emails/emails.module';
import { SentEmailsModule } from './sent-emails/sent-emails.module';
import { CdpsModule } from './cdps/cdps.module';
import { AgendaLinksModule } from './agenda-links/agenda-links.module';
import { EventsModule } from './events/events.module';
import { GoalsModule } from './goals/goals.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { RemindersModule } from './reminders/reminders.module';
import { CdpsModule } from './cdps/cdps.module';

@Module({
  imports: [ActivitiesModule, CitiesModule, CountriesModule, MeetingsModule, WebsitesModule, PhonesModule, EmailsModule, SentEmailsModule, CdpsModule, RemindersModule, ProjectManagersModule, BookmarksModule, GoalsModule, EventsModule, AgendaLinksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
