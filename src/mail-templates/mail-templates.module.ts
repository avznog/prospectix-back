import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleService } from 'src/google/google.service';
import { MailTemplate } from './entities/mail-template.entity';
import { MailTemplatesController } from './mail-templates.controller';
import { MailTemplatesService } from './mail-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([MailTemplate])],
  controllers: [MailTemplatesController],
  providers: [MailTemplatesService, GoogleService]
})
export class MailTemplatesModule {}
