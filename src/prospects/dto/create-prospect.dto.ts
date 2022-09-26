import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activities/entities/activity.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { City } from 'src/cities/entities/city.entity';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { Country } from 'src/countries/entities/country.entity';
import { Email } from 'src/emails/entities/email.entity';
import { Event } from 'src/events/entities/event.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Website } from 'src/websites/entities/website.entity';

export class CreateProspectDto {
  @ApiProperty({
    description: "Nom de l'entreprise",
    required: true,
  })
  companyName: string;

  @ApiProperty({
    description: "Domaine d'activité de l'entreprise",
    required: true,
  })
  activity: Activity;

  @ApiProperty({
    description: 'Adresse postale',
    required: true,
  })
  streetAddress: string;

  @ApiProperty({
    description: 'Ville',
    required: true,
  })
  city: City;

  @ApiProperty({
    description: 'Pays',
    required: true,
  })
  country: Country;

  @ApiProperty({
    description: 'Numéro de téléphone',
  })
  phone: Phone;

  @ApiProperty({
    description: "Email de l'entreprise",
  })
  email: Email;

  @ApiProperty({
    description: "Lien du site web de l'entreprise",
  })
  website: Website;

  @ApiProperty({
    description: 'RDV avec ce prospect',
  })
  meetings: Meeting[];

  @ApiProperty({
    description: 'Rappels des CDP pour ce prospect',
  })
  reminders: Reminder[];

  @ApiProperty({
    description: 'Qui a mis ce prospect en favori ?',
  })
  bookmarks: Bookmark[];

  @ApiProperty({
    description: 'Indique si le prospect est mis en favoris'
  })
  isBookmarked: boolean;

  @ApiProperty({
    description: 'Toutes les interactions CDP / Prospect',
  })
  events: Event[];

  @ApiProperty({
    description: 'Commentaire de prospection',
  })
  comment: string;

  @ApiProperty({
    description: 'Number No, Nombre de "NON" suite à la prospection',
  })
  nbNo: number;

  @ApiProperty({
    description: 'Prospect is enabled or not',
  })
  disabled: boolean;

  @ApiProperty({
    description: 'Situtaiton du prospect',
  })
  stage: StageType;

  @ApiProperty({
    description: 'Date d\' archivage du prospect',
  })
  archived: Date;

  @ApiProperty({
    description: "Raison de suppression du prospect",
    required: false
  })
  reasonDisabled: ReasonDisabledType;
}