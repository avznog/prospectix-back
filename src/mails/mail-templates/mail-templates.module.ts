import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplate } from './entities/mail-template.entity';
import { MailTemplatesController } from './mail-templates.controller';
import { MailTemplatesService } from './mail-templates.service';
import { SentryService } from '../../apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([MailTemplate])],
  controllers: [MailTemplatesController],
  providers: [MailTemplatesService, SentryService]
})
export class MailTemplatesModule {}
