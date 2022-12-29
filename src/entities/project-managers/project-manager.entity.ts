import { ApiProperty } from '@nestjs/swagger';
import { Bookmark } from 'src/entities/bookmarks/bookmark.entity';
import { Call } from 'src/entities/calls/call.entity';
import { Event } from 'src/entities/events/event.entity';
import { Goal } from 'src/entities/goals/goal.entity';
import { MailTemplate } from 'src/entities/mail-templates/mail-template.entity';
import { Meeting } from 'src/entities/meetings/meeting.entity';
import { NegativeAnswer } from 'src/entities/negative-answers/negative-answer.entity';
import { Reminder } from 'src/entities/reminders/reminder.entity';
import { SentEmail } from 'src/entities/sent-emails/sent-email.entity';
import {
  BaseEntity,
  Column,
  Entity, OneToMany, PrimaryGeneratedColumn
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

  @Column({ default: "", nullable: true, })
  @ApiProperty({
    description: "Téléphone du chef de projet",
    required: false
  })
  phone: string;

  @Column()
  @ApiProperty({
    description: "Token email du chef de projet",
    required: true
  })
  tokenGoogle: string;

  @Column()
  @ApiProperty({
    description: "Boolean indiquant si le chef de projet / compte est désactivé (supprimé pour les utilisateurs)",
    required: true
  })
  disabled: boolean;

  @Column()
  @ApiProperty({
    description: "Active ou non l'apparition dans les statistiques",
    required: true
  })
  statsEnabled: boolean;

  @OneToMany(() => Meeting, (meeting) => meeting.pm)
  @ApiProperty({
    description: "Rendez-vous du chef de projet",
    required: true
  })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.pm, {
    
    nullable: true
  })
  @ApiProperty({
    description: "Rappels du chef de projet",
    required: true
  })
  reminders: Reminder[];

  @OneToMany(() => SentEmail, (sentEmail) => sentEmail.pm, {
    
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

  @OneToMany(() => Call, (call) => call.pm, { nullable: true})
  @ApiProperty({
    description: "Appels du chef de projet",
    required: false
  })
  calls: Call[];

  @OneToMany(() => NegativeAnswer, (negativeAnswer) => negativeAnswer.pm, { nullable: true })
  @ApiProperty({
    description: "Refus du chef de projet",
    required: false
  })
  negativeAnswers: NegativeAnswer[];

  @OneToMany(() => Goal, (goal) => goal.pm)
  @ApiProperty({
    description: "Objectifs liés au pm"
  })
  goals: Goal[];

  @Column({default: false})
  @ApiProperty({
    description: "Apparaît dans les objectifs ou non"
  })
  objectived: boolean;
  
  @OneToMany(() => MailTemplate, (mailTemplate) => mailTemplate.pm, {nullable: true})
  @ApiProperty({
    required: false,
    description: "Les mails templates du chef de projet"
  })
  mailTemplates: MailTemplate[];
}
