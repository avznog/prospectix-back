import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { MailTemplate } from './entities/mail-template.entity';
import { MailTemplatesController } from './mail-templates.controller';
import { MailTemplatesService } from './mail-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([MailTemplate])],
  controllers: [MailTemplatesController],
  providers: [MailTemplatesService, SentryService]
})
export class MailTemplatesModule {}
