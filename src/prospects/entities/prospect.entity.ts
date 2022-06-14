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
  OneToOne,
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
  streetAddress: string;

  @ManyToOne(() => City)
  city: City;

  @ManyToOne(() => Country)
  country: Country;

  @OneToOne(() => Phone, (phone) => phone.prospect, { lazy: true })
  phone: Phone;

  @OneToOne(() => Email, (email) => email.prospect, { lazy: true })
  email: Email;

  @OneToOne(() => Website, (website) => website.prospect, { lazy: true })
  website: Website;

  @OneToMany(() => Meeting, (meeting) => meeting.prospect, { lazy: true })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.prospect, { lazy: true })
  reminders: Reminder[];

  @OneToOne(() => Bookmark, (bookmark) => bookmark.prospect, { lazy: true })
  bookmarks: Bookmark[];

  @OneToMany(() => Event, (event) => event.prospect, { lazy: true })
  events: Event[];

  @Column()
  comment: string;

  @Column()
  nbNo: number;

  @Column()
  disabled: boolean;
}
