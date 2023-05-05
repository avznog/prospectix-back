import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { SlackModule } from './slack/slack.module';
import { SentryModule } from './sentry/sentry.module';

@Module({
  imports: [GoogleModule, SlackModule, SentryModule]
})
export class ApisModule {}
