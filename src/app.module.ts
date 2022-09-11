import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth/entities/auth.entity';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { ProjectManager } from './project-managers/entities/project-manager.entity';
import { Prospect } from './prospects/entities/prospect.entity';
import { Reminder } from './reminders/entities/reminder.entity';
import { ProspectsModule } from './prospects/prospects.module';
import { RemindersModule } from './reminders/reminders.module';
import { Meeting } from './meetings/entities/meeting.entity';
import { Activity } from './activities/entities/activity.entity';
import { AgendaLink } from './agenda-links/entities/agenda-link.entity';
import { Bookmark } from './bookmarks/entities/bookmark.entity';
import { City } from './cities/entities/city.entity';
import { Country } from './countries/entities/country.entity';
import { Email } from './emails/entities/email.entity';
import { Goal } from './goals/entities/goal.entity';
import { Phone } from './phones/entities/phone.entity';
import { SentEmail } from './sent-emails/entities/sent-email.entity';
import { Website } from './websites/entities/website.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { ActivitiesModule } from './activities/activities.module';
import { AgendaLinksModule } from './agenda-links/agenda-links.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { EmailsModule } from './emails/emails.module';
import { GoalsModule } from './goals/goals.module';
import { PhonesModule } from './phones/phones.module';
import { SentEmailsModule } from './sent-emails/sent-emails.module';
import { WebsitesModule } from './websites/websites.module';
import { Event } from './events/entities/event.entity';
import { EventsModule } from './events/events.module';
console.log(process.env.BASE_URL)
@Module({
  imports: [
    AuthModule,
    ProjectManagersModule,
    ProspectsModule,
    RemindersModule,
    MeetingsModule,
    ActivitiesModule,
    AgendaLinksModule,
    BookmarksModule,
    CitiesModule,
    CountriesModule,
    EmailsModule,
    GoalsModule,
    PhonesModule,
    SentEmailsModule,
    EventsModule,
    WebsitesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || "localhost",
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "postgres",
      database: process.env.POSTGRES_DATABASE ?? 'prospectix9',
      // url: `pgsql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/prospectix`,
      synchronize: true,
      entities: [Auth, ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Goal, Phone, SentEmail, Website],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }