import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { PhonesController } from './phones.controller';
import { PhonesService } from './phones.service';
import { SentryService } from 'src/apis/sentry/sentry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  controllers: [PhonesController],
  providers: [PhonesService, SentryService]
})
export class PhonesModule {}
