import * as Joi from '@hapi/joi';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';


import { ActionsModule } from './actions/actions.module';
import { AdminModule } from './admin/admin.module';
import { ApisModule } from './apis/apis.module';
import { AuthModule } from './auth/auth.module';
import { GoalsGlobalModule } from './goals-global/goals-global.module';
import { MailsModule } from './mails/mails.module';
import { ProspectGlobalModule } from './prospect-global/prospect-global.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HttpModule,
    // TypeOrmModule.forFeature(), // TypeOrmModule.forFeature([Slack, Website....])
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
      // host: process.env.POSTGRES_HOST || "192.168.0.158",
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE ?? 'prod',
      // url: `pgsql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/prospectix`,
      synchronize: true,
      // entities: [SearchParams, PrimaryActivity, SecondaryActivity, Bookmark, City, Call, Country, Email, Event, GoalTemplate, Goal, MailTemplate, Meeting, NegativeAnswer, Phone, ProjectManager, Prospect, Reminder, SentEmail, Website],
      entities: ["../src/**/*.entity.ts"]
    }),
    
    ScheduleModule.forRoot(),
    
    ActionsModule,
    
    AdminModule,

    ApisModule,
    
    AuthModule,

    GoalsGlobalModule,

    MailsModule,

    ProspectGlobalModule,

    UsersModule,

  ],
  // controllers: [AppController, SecondaryActivitiesController, BookmarksController, CitiesController, CallsController, CountriesController, EmailsController, EventsController, GoalTemplatesController, GoalsController, GoogleController, MailTemplatesController, MeetingsController, NegativeAnswersController, PhonesController, ProjectManagersController, ProspectsController, RemindersController, SentEmailsController, SlackController, WebsitesController, PrimaryActivityController, SearchParamsController],
  // providers: [AppService, SecondaryActivitiesService, BookmarksService, CitiesService, CallsService, CountriesService, EmailsService, EventsService, GoalTemplatesService, GoalsService, GoogleService, MailTemplatesService, MeetingsService, NegativeAnswersService, PhonesService, ProjectManagersService, ProspectsService, RemindersService, SentEmailsService, SlackService, WebsitesService, SentryService, PrimaryActivityService, SearchParamsService],

})
export class AppModule { }