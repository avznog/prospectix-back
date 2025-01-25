import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CallsService } from "../../actions/calls/calls.service";
import { Call } from "../../actions/calls/entities/call.entity";
import { Meeting } from "../../actions/meetings/entities/meeting.entity";
import { MeetingsService } from "../../actions/meetings/meetings.service";
import { Reminder } from "../../actions/reminders/entities/reminder.entity";
import { SearchParams } from "../../admin/search-params/entities/search-params.entity";
import { MailTemplate } from "../../mails/mail-templates/entities/mail-template.entity";
import { MailTemplatesService } from "../../mails/mail-templates/mail-templates.service";
import { PrimaryActivity } from "../../prospect-global/activities/primary-activities/entities/primary-activity.entity";
import { PrimaryActivityService } from "../../prospect-global/activities/primary-activities/primary-activity.service";
import { SecondaryActivity } from "../../prospect-global/activities/secondary-activities/entities/secondary-activity.entity";
import { SecondaryActivitiesService } from "../../prospect-global/activities/secondary-activities/secondary-activities.service";
import { ProjectManager } from "../../users/project-managers/entities/project-manager.entity";
import { GoogleService } from "../google/google.service";
import { SentryService } from "../sentry/sentry.service";
import { SlackController } from "./slack.controller";
import { SlackService } from "./slack.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Reminder, Call, Meeting, SecondaryActivity, PrimaryActivity, SearchParams, MailTemplate]), HttpModule],
  controllers: [SlackController],
  providers: [SlackService, CallsService, MeetingsService, GoogleService, SecondaryActivitiesService, PrimaryActivityService, MailTemplatesService, SentryService]
})
export class SlackModule {}
