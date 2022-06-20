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
import { Event } from './events/entities/event.entity';
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
import { EventsModule } from './events/events.module';
import { GoalsModule } from './goals/goals.module';
import { PhonesModule } from './phones/phones.module';
import { SentEmailsModule } from './sent-emails/sent-emails.module';
import { WebsitesModule } from './websites/websites.module';

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
    EventsModule,
    GoalsModule,
    PhonesModule,
    SentEmailsModule,
    WebsitesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'prospectix',
      // url: "postgres://" + process.env.DB_USER + ":" + process.env.DB_PW + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/prospectix",
      url: "pgsql://postgres:gJdh]&qpTC2h6@127.0.0.1:5432/prospectix",
      // A TESTER EN REVENANT
      // url: "pgsql://postgres:gJdh]&qpTC2h6@db:5432/prospectix",
      // url: "pgsql://postgres:gJdh]&qpTC2h6@127.0.0.1:5432/prospectix",
      synchronize: true,
      entities: [Auth, ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Goal, Phone, SentEmail, Website],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
