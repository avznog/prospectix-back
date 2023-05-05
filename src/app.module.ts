import * as Joi from '@hapi/joi';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecondaryActivitiesController } from './controllers/secondary-activities/secondary-activities.controller';
import { BookmarksController } from './controllers/bookmarks/bookmarks.controller';
import { CallsController } from './controllers/calls/calls.controller';
import { CitiesController } from './controllers/cities/cities.controller';
import { CountriesController } from './controllers/countries/countries.controller';
import { EmailsController } from './controllers/emails/emails.controller';
import { EventsController } from './controllers/events/events.controller';
import { GoalsController } from './controllers/goals/goals.controller';
import { GoogleController } from './controllers/google/google.controller';
import { MailTemplatesController } from './controllers/mail-templates/mail-templates.controller';
import { MeetingsController } from './controllers/meetings/meetings.controller';
import { NegativeAnswersController } from './controllers/negative-answers/negative-answers.controller';
import { PhonesController } from './controllers/phones/phones.controller';
import { ProjectManagersController } from './controllers/project-managers/project-managers.controller';
import { ProspectsController } from './controllers/prospects/prospects.controller';
import { RemindersController } from './controllers/reminders/reminders.controller';
import { SentEmailsController } from './controllers/sent-emails/sent-emails.controller';
import { SlackController } from './controllers/slack/slack.controller';
import { WebsitesController } from './controllers/websites/websites.controller';
import { SecondaryActivity } from './entities/secondary-activities/secondary-activity.entity';
import { Bookmark } from './entities/bookmarks/bookmark.entity';
import { Call } from './entities/calls/call.entity';
import { City } from './prospect-global/cities/entities/city.entity';
import { Country } from './entities/countries/country.entity';
import { Email } from './entities/emails/email.entity';
import { Event } from './entities/events/event.entity';
import { GoalTemplate } from './entities/goal-templates/goal-template.entity';
import { Goal } from './entities/goals/goal.entity';
import { Google } from './entities/google/google.entity';
import { MailTemplate } from './entities/mail-templates/mail-template.entity';
import { Meeting } from './entities/meetings/meeting.entity';
import { NegativeAnswer } from './entities/negative-answers/negative-answer.entity';
import { Phone } from './entities/phones/phone.entity';
import { ProjectManager } from './entities/project-managers/project-manager.entity';
import { Prospect } from './entities/prospects/prospect.entity';
import { Reminder } from './entities/reminders/reminder.entity';
import { SentEmail } from './entities/sent-emails/sent-email.entity';
import { Slack } from './entities/slack/slack.entity';
import { Website } from './entities/websites/website.entity';
import { SecondaryActivitiesService } from './services/secondary-activities/secondary-activities.service';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import { CallsService } from './services/calls/calls.service';
import { CitiesService } from './services/cities/cities.service';
import { CountriesService } from './services/countries/countries.service';
import { EmailsService } from './services/emails/emails.service';
import { EventsService } from './services/events/events.service';
import { GoalTemplatesService } from './services/goal-templates/goal-templates.service';
import { GoalsService } from './services/goals/goals.service';
import { GoogleService } from './services/google/google.service';
import { MailTemplatesService } from './services/mail-templates/mail-templates.service';
import { MeetingsService } from './services/meetings/meetings.service';
import { NegativeAnswersService } from './services/negative-answers/negative-answers.service';
import { PhonesService } from './services/phones/phones.service';
import { ProjectManagersService } from './services/project-managers/project-managers.service';
import { ProspectsService } from './services/prospects/prospects.service';
import { RemindersService } from './services/reminders/reminders.service';
import { SentEmailsService } from './services/sent-emails/sent-emails.service';
import { SlackService } from './services/slack/slack.service';
import { WebsitesService } from './services/websites/websites.service';
import { GoalTemplatesController } from './controllers/goal-templates/goal-templates.controller';
import { AuthModule } from './auth/auth.module';
import { SentryService } from './services/sentry/sentry.service';
import { PrimaryActivityController } from './controllers/primary-activity/primary-activity/primary-activity.controller';
import { PrimaryActivityService } from './services/primary-activity/primary-activity.service';
import { PrimaryActivity } from './entities/primary-activity/primary-activity.entity';
import { SearchParams } from './entities/search-params/search-params.entity';
import { SearchParamsController } from './controllers/search-params/search-params.controller';
import { SearchParamsService } from './services/search-params/search-params.service';
import { SecondaryActivityModule } from './secondary-activity/secondary-activity.module';
import { CitiesModule } from './prospect-global/cities/cities/cities.module';
import { CitiesModule } from './prospect-global/cities/cities.module';
import { ActivitiesModule } from './prospect-global/activities/activities.module';
import { ActionsModule } from './actions/actions.module';
import { ProspectGlobalModule } from './prospect-global/prospect-global.module';
import { UsersModule } from './users/users.module';
import { ApisModule } from './apis/apis.module';
import { MailsModule } from './mails/mails.module';
import { AdminModule } from './admin/admin.module';
import { GoalsGlobalModule } from './goals-global/goals-global.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    TypeOrmModule.forFeature([SearchParams, SecondaryActivity, PrimaryActivity, Bookmark, City, Call, Country, Email, Event, GoalTemplate, Goal, Google, MailTemplate, Meeting, NegativeAnswer, Phone, ProjectManager, Prospect, Reminder, SentEmail, Slack, Website]),
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
      entities: [SearchParams, PrimaryActivity, SecondaryActivity, Bookmark, City, Call, Country, Email, Event, GoalTemplate, Goal, Google, MailTemplate, Meeting, NegativeAnswer, Phone, ProjectManager, Prospect, Reminder, SentEmail, Slack, Website],
    }),

    ScheduleModule.forRoot(),

    SecondaryActivityModule,

    CitiesModule,

    ActivitiesModule,

    ActionsModule,

    ProspectGlobalModule,

    UsersModule,

    ApisModule,

    MailsModule,

    AdminModule,

    GoalsGlobalModule,

  ],
  controllers: [AppController, SecondaryActivitiesController, BookmarksController, CitiesController, CallsController, CountriesController, EmailsController, EventsController, GoalTemplatesController, GoalsController, GoogleController, MailTemplatesController, MeetingsController, NegativeAnswersController, PhonesController, ProjectManagersController, ProspectsController, RemindersController, SentEmailsController, SlackController, WebsitesController, PrimaryActivityController, SearchParamsController],
  providers: [AppService, SecondaryActivitiesService, BookmarksService, CitiesService, CallsService, CountriesService, EmailsService, EventsService, GoalTemplatesService, GoalsService, GoogleService, MailTemplatesService, MeetingsService, NegativeAnswersService, PhonesService, ProjectManagersService, ProspectsService, RemindersService, SentEmailsService, SlackService, WebsitesService, SentryService, PrimaryActivityService, SearchParamsService],

})
export class AppModule { }