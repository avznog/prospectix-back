import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { TypeOrmModule} from "@nestjs/typeorm";
import { Reminder } from './entities/reminder.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { ProjectManagersService } from 'src/project-managers/project-managers.service';
import { ProspectsService } from 'src/prospects/prospects.service';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { AgendaLink } from 'src/agenda-links/entities/agenda-link.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import { Website } from 'src/websites/entities/website.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager, Prospect, Reminder, Meeting, Activity, AgendaLink, Bookmark, City, Country, Email, Event, Goal, Phone, SentEmail, Website])],
  controllers: [RemindersController],
  providers: [RemindersService, ProjectManagersService, ProspectsService]
})
export class RemindersModule {}
