import { Module } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { SentEmailsController } from './sent-emails.controller';

@Module({
  controllers: [SentEmailsController],
  providers: [SentEmailsService]
})
export class SentEmailsModule {}
