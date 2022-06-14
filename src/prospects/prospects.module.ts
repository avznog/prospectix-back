import { Module } from '@nestjs/common';
import { ProspectsService } from './prospects.service';
import { ProspectsController } from './prospects.controller';
import { Prospect } from './entities/prospect.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { Email } from 'src/emails/entities/email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from 'src/websites/entities/website.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Event } from 'src/events/entities/event.entity';
import { ActivitiesController } from 'src/activities/activities.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prospect, Activity]),
  ],
  controllers: [ProspectsController],
  providers: [ProspectsService],
})
export class ProspectsModule {}
