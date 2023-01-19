import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { AgendaLink } from 'src/agenda-links/entities/agenda-link.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Call } from 'src/calls/entities/call.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Event } from 'src/events/entities/event.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import { Website } from 'src/websites/entities/website.entity';
import { Prospect } from './entities/prospect.entity';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from './prospects.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Phone, SentEmail, Website, Event, Call])],
  controllers: [ProspectsController],
  providers: [ProspectsService],
})
export class ProspectsModule {}
