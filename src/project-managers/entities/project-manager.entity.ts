import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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

@Entity({ name: 'project-manager' })
export class ProjectManager extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du chef de projet",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Pseudo du chef de projet",
    required: true
  })
  pseudo: string;

  @Column()
  @ApiProperty({
    description: "Admin ? true ou false",
    required: true
  })
  admin: boolean;

  @Column({ nullable: true })
  @Exclude()
  @ApiProperty({
    description: "Refresh token en place du chef de projet",
    required: true
  })
  currentHashedRefreshToken?: string;
  
  @Column()
  @ApiProperty({
    description: "Nom du chef de projet",
    required: true
  })
  name: string;

  @Column()
  @ApiProperty({
    description: "Prénom du chef de projet",
    required: true
  })
  firstname: string;

  @Column()
  @ApiProperty({
    description: "Mail du chef de projet",
    required: true
  })
  mail: string;

  @Column()
  @ApiProperty({
    description: "Token email du chef de projet",
    required: true
  })
  tokenEmail: string;

  @OneToMany(() => Goal, (goal) => goal.pm, { lazy: true })
  @ApiProperty({
    description: "Objectifs du chef de projet",
    required: true
  })
  goals: Goal[];

  @OneToMany(() => Meeting, (meeting) => meeting.pm, { lazy: true })
  @ApiProperty({
    description: "Rendez-vous du chef de projet",
    required: true
  })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.pm, {
    lazy: true,
  })
  @ApiProperty({
    description: "Rappels du chef de projet",
    required: true
  })
  reminders: Reminder[];

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.pm, {
    lazy: true,
  })
  @ApiProperty({
    description: "Emails envoyés du chef de projet",
    required: true
  })
  sentEmails: SentEmail[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.pm, {
    lazy: true,
  })
  @ApiProperty({
    description: "Favoris du chef de projet",
    required: true
  })
  bookmarks: Bookmark[];

  @OneToMany(() => Event, (event) => event.prospect, { lazy: true })
  @ApiProperty({
    description: "Evènement du chef de projet",
    required: true
  })
  events: Event[];
}
