import { Module } from '@nestjs/common';
import { MailTemplatesModule } from './mail-templates/mail-templates.module';

@Module({
  imports: [MailTemplatesModule]
})
export class MailsModule {}
