import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  controllers: [EmailsController],
  providers: [EmailsService, SentryService]
})
export class EmailsModule {}
