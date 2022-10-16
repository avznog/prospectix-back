import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProspectsService } from 'src/prospects/prospects.service';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { Activity } from 'src/activities/entities/activity.entity';
import { AgendaLink } from 'src/agenda-links/entities/agenda-link.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import { Website } from 'src/websites/entities/website.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Goal, Phone, SentEmail, Website])],

  controllers: [MeetingsController],
  providers: [MeetingsService, ProspectsService, ProjectManagersService]
})
export class MeetingsModule {}
