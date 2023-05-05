import { Module } from '@nestjs/common';
import { CallsModule } from './calls/calls.module';
import { MeetingsModule } from './meetings/meetings.module';
import { RemindersModule } from './reminders/reminders.module';
import { NegativeAnswersModule } from './negative-answers/negative-answers.module';
import { SentEmailsModule } from './sent-emails/sent-emails.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [BookmarksModule, CallsModule, MeetingsModule, RemindersModule, NegativeAnswersModule, SentEmailsModule]
})
export class ActionsModule {}
