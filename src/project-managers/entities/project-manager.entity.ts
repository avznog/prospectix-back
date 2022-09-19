import { ApiProperty } from '@nestjs/swagger';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Event } from 'src/events/entities/event.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { SentEmail } from 'src/sent-emails/entities/sent-email.entity';
import { Statistic } from 'src/statistics/entities/statistic.entity';
import { StatsHistory } from 'src/stats-history/entities/stats-history.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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

  @Column()
  @ApiProperty({
    description: "Boolean indiquant si le chef de projet / compte est désactivé (supprimé pour les utilisateurs)",
    required: true
  })
  disabled: boolean;

  @OneToMany(() => Goal, (goal) => goal.pm)
  @ApiProperty({
    description: "Objectifs du chef de projet",
    required: true
  })
  goals: Goal[];

  @OneToMany(() => Meeting, (meeting) => meeting.pm)
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

  @OneToMany(() => Event, (event) => event.prospect)
  @ApiProperty({
    description: "Evènement du chef de projet",
    required: true
  })
  events: Event[];

  @OneToOne(() => Statistic, { nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: "Statistiques du chef de projet",
    required: false
  })
  statistic: Statistic;

  @OneToMany(() => StatsHistory, (statsHistory) => statsHistory.pm)
  @ApiProperty({
    description: "Historique des statistiques du chef de projet",
    required: false
  })
  statsHistory: StatsHistory[];
}
