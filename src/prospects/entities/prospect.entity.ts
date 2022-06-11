import { Activity } from 'src/activities/entities/activity.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Event } from 'src/events/entities/event.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Website } from 'src/websites/entities/website.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'prospects' })
export class Prospect extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  companyName: string;

  @ManyToOne(() => Activity)
  activity: Activity;

  @Column()
  phone: string;

  @Column()
  streetAddress: string;

  @ManyToOne(() => City)
  city: City;

  @ManyToOne(() => Country)
  country: Country;

  @Column()
  website: string;

  @Column()
  lastEvent: string;

  @Column()
  comment: string;

  @Column()
  nbNo: number;

  @OneToMany(() => Meeting, (meeting) => meeting.prospect, { lazy: true })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.prospect, { lazy: true })
  reminders: Reminder[];

  @OneToMany(() => Email, (email) => email.prospect, { lazy: true })
  emails: Email[];

  @OneToMany(() => Phone, (phone) => phone.prospect, { lazy: true })
  phones: Phone[];

  @OneToMany(() => Website, (website) => website.prospect, { lazy: true })
  websites: Website[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.prospect, { lazy: true })
  bookmarks: Bookmark[];

  @OneToMany(() => Event, (event) => event.prospect, { lazy: true })
  events: Event[];
}
