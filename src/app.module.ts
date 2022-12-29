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
import { Bookmark } from './entities/bookmarks/bookmark.entity';
import { CallsModule } from './calls/calls.module';
import { Call } from './entities/calls/call.entity';
import { CitiesModule } from './cities/cities.module';
import { City } from './entities/cities/city.entity';
import { CountriesModule } from './countries/countries.module';
import { Country } from './entities/countries/country.entity';
import { EmailsModule } from './emails/emails.module';
import { Email } from './entities/emails/email.entity';
import { Event } from './entities/events/event.entity';
import { EventsModule } from './events/events.module';
import { Meeting } from './entities/meetings/meeting.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { NegativeAnswer } from './entities/negative-answers/negative-answer.entity';
import { NegativeAnswersModule } from './negative-answers/negative-answers.module';
import { Phone } from './entities/phones/phone.entity';
import { PhonesModule } from './phones/phones.module';
import { ProjectManager } from './entities/project-managers/project-manager.entity';
import { ProjectManagersModule } from './project-managers/project-managers.module';
import { Prospect } from './entities/prospects/prospect.entity';
import { ProspectsModule } from './prospects/prospects.module';
import { Reminder } from './entities/reminders/reminder.entity';
import { RemindersModule } from './reminders/reminders.module';
import { SentEmail } from './entities/sent-emails/sent-email.entity';
import { Slack } from './slack/entities/slack.entity';
import { SlackModule } from './slack/slack.module';
import { Website } from './entities/websites/website.entity';
import { WebsitesModule } from './websites/websites.module';
import { GoalTemplatesModule } from './goal-templates/goal-templates.module';
import { GoalsModule } from './goals/goals.module';
import { Goal } from './entities/goals/goal.entity';
import { GoalTemplate } from './entities/goal-templates/goal-template.entity';
import { GoogleModule } from './google/google.module';
import { Google } from './google/entities/google.entity';
import { MailTemplatesModule } from './mail-templates/mail-templates.module';
import { MailTemplate } from './entities/mail-templates/mail-template.entity';
import { SentEmailsController } from './controllers/sent-emails/sent-emails.controller';
import { SentEmailsService } from './services/sent-emails/sent-emails.service';
import { GoogleService } from './google/google.service';
import { MailTemplatesService } from './mail-templates/mail-templates.service';
@Module({
  imports: [
   TypeOrmModule.forFeature([SentEmail, ProjectManager, Prospect, MailTemplate]),
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
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    
    ScheduleModule.forRoot(),
    
  ],
  controllers: [AppController, SentEmailsController],
  providers: [AppService, SentEmailsService, GoogleService, MailTemplatesService],

})
export class AppModule { }