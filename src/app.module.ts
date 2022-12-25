import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from './activities/activities.module';
import { Activity } from './activities/entities/activity.entity';
import { AgendaLinksModule } from './agenda-links/agenda-links.module';
import { AgendaLink } from './agenda-links/entities/agenda-link.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { Bookmark } from './bookmarks/entities/bookmark.entity';
import { CallsModule } from './calls/calls.module';
import { Call } from './calls/entities/call.entity';
import { CitiesModule } from './cities/cities.module';
import { City } from './cities/entities/city.entity';
import { CountriesModule } from './countries/countries.module';
import { Country } from './countries/entities/country.entity';
import { EmailsModule } from './emails/emails.module';
import { Email } from './emails/entities/email.entity';
import { Event } from './events/entities/event.entity';
import { EventsModule } from './events/events.module';
import { Meeting } from './meetings/entities/meeting.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { NegativeAnswer } from './negative-answers/entities/negative-answer.entity';
import { NegativeAnswersModule } from './negative-answers/negative-answers.module';
import { Phone } from './phones/entities/phone.entity';
import { PhonesModule } from './phones/phones.module';
import { ProjectManager } from './project-managers/entities/project-manager.entity';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { Prospect } from './prospects/entities/prospect.entity';
import { ProspectsModule } from './prospects/prospects.module';
import { Reminder } from './reminders/entities/reminder.entity';
import { RemindersModule } from './reminders/reminders.module';
import { SentEmail } from './sent-emails/entities/sent-email.entity';
import { SentEmailsModule } from './sent-emails/sent-emails.module';
import { Slack } from './slack/entities/slack.entity';
import { SlackModule } from './slack/slack.module';
import { Website } from './websites/entities/website.entity';
import { WebsitesModule } from './websites/websites.module';
import { GoalTemplatesModule } from './goal-templates/goal-templates.module';
import { GoalsModule } from './goals/goals.module';
import { Goal } from './goals/entities/goal.entity';
import { GoalTemplate } from './goal-templates/entities/goal-template.entity';
import { GoogleModule } from './google/google.module';
import { Google } from './google/entities/google.entity';
import { MailTemplatesModule } from './mail-templates/mail-templates.module';
import { MailTemplate } from './mail-templates/entities/mail-template.entity';
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
    PhonesModule,
    SentEmailsModule,
    EventsModule,
    WebsitesModule,
    CallsModule,
    NegativeAnswersModule,
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
      host: process.env.POSTGRES_HOST || "192.168.0.158",
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE ?? 'dev',
      // url: `pgsql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/prospectix`,
      synchronize: true,
      entities: [Auth, ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Phone, SentEmail, Website, Call, NegativeAnswer, Slack, Goal, GoalTemplate, Google, MailTemplate],
    }),
    SlackModule,
    ScheduleModule.forRoot(),
    GoalTemplatesModule,
    GoalsModule,
    GoogleModule,
    MailTemplatesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }