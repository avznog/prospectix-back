import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Event } from 'src/events/entities/event.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cdp' })
export class ProjectManager extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  mail: string;

  @Column()
  pseudo: string;

  @Column()
  tokenEmail: string;

  @OneToMany(() => Goal, (goal) => goal.projectManager, { lazy: true })
  goals: Goal[];

  @OneToMany(() => Meeting, (meeting) => meeting.projectManager, { lazy: true })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.pm, {
    lazy: true,
  })
  reminders: Reminder[];

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.projectManager, {
    lazy: true,
  })
  sentEmails: SentEmail[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.projectManager, {
    lazy: true,
  })
  bookmarks: Bookmark[];

  @OneToMany(() => Event, (event) => event.prospect, { lazy: true })
  events: Event[];
}
