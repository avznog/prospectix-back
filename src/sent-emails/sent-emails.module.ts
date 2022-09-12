import { Module } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { SentEmailsController } from './sent-emails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentEmail } from './entities/sent-email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentEmail])],
  controllers: [SentEmailsController],
  providers: [SentEmailsService]
})
export class SentEmailsModule {}
