import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from 'src/activities/entities/activity.entity';
import { AgendaLink } from 'src/agenda-links/entities/agenda-link.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { ProspectsService } from 'src/prospects/prospects.service';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import { Website } from 'src/websites/entities/website.entity';
import { Reminder } from './entities/reminder.entity';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Phone, SentEmail, Website])],
  controllers: [RemindersController],
  providers: [RemindersService, ProjectManagersService, ProspectsService]
})
export class RemindersModule {}
