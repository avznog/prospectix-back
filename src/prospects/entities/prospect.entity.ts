import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activities/entities/activity.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { StageType } from 'src/constants/stage.type';
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
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Prospect extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id du prospect",
    required: true
  })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Nom de l'entreprise du prospect",
    required: true
  })
  companyName: string;

  @ManyToOne(() => Activity, { cascade: ["insert"], nullable: true})
  @ApiProperty({
    description: "Secteur d'activité du prospect",
    required: true
  })
  activity: Activity;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Addresse (rue) du prospect",
    required: true
  })
  streetAddress: string;

  @ManyToOne(() => City, { cascade: ["insert"], nullable: true})
  @ApiProperty({
    description: "Ville du prospect",
    required: true
  })
  city: City;

  @ManyToOne(() => Country, { cascade: ["insert"], nullable: true })
  @ApiProperty({
    description: "Pays du prospect",
    required: true
  })
  country: Country;

  @OneToOne(() => Phone, { cascade: ["insert"], nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: "Numéro de téléphone du prospect",
    required: true
  })
  phone: Phone;

  @OneToOne(() => Email, { cascade: ["insert"], nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: "Email du prospect",
    required: true
  })
  email: Email;

  @OneToOne(() => Website, { cascade: ["insert"], nullable: true })
  @JoinColumn()
  @ApiProperty({
    description: "Site internet du prospect",
    required: true
  })
  website: Website;

  @OneToMany(() => Meeting, (meeting) => meeting.prospect, { nullable: true })
  @ApiProperty({
    description: "Rendez-vous du prospect",
    required: true
  })
  meetings: Meeting[];

  @OneToMany(() => Reminder, (reminder) => reminder.prospect, { nullable: true })
  @ApiProperty({
    description: "Rappels du prospect",
    required: true
  })
  reminders: Reminder[];

  @OneToOne(() => Bookmark, (bookmark) => bookmark.prospect, { nullable: true })
  @ApiProperty({
    description: "Favoris du prospect",
    required: true
  })
  bookmarks: Bookmark[];

  @Column({ nullable: true })
  @ApiProperty({
    description: "Indique si le prospect est mis en favoris",
    required: true
  })
  isBookmarked: boolean;

  @OneToMany(() => Event, (event) => event.prospect, { nullable: true })
  @ApiProperty({
    description: "Evènements du prospect",
    required: true
  })
  events: Event[];

  @Column({ nullable: true })
  @ApiProperty({
    description: "Commentaires sur le prospect",
    required: true
  })
  comment: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Numéro du prospect",
    required: true
  })
  nbNo: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Booléen: au lieu de supprimer les prospects, on les désactive",
    required: true
  })
  disabled: boolean;

  @Column({nullable: true})
  @ApiProperty({
    description: "Situtation du prospect actuelle",
    required: false
  })
  stage: StageType;

  @Column({nullable: true})
  @ApiProperty({
    description: "Date d'archivage du prospect",
    required: false
  })
  archived: Date;
}
