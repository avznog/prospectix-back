import { ApiProperty } from '@nestjs/swagger';
import { Reminder } from 'src/actions/reminders/entities/reminder.entity';
import { Bookmark } from 'src/actions/bookmarks/entities/bookmark.entity';
import { ReasonDisabledType } from 'src/constants/reasonDisabled.type';
import { StageType } from 'src/constants/stage.type';
import { SecondaryActivity } from 'src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity';
import { City } from 'src/prospect-global/cities/entities/city.entity';
import { Country } from 'src/prospect-global/countries/entities/country.entity';
import { Email } from 'src/prospect-global/emails/entities/email.entity';
import { Event } from 'src/admin/events/entities/event.entity';
import { Meeting } from 'src/actions/meetings/entities/meeting.entity';
import { Phone } from 'src/prospect-global/phones/entities/phone.entity';
import { Website } from 'src/prospect-global/websites/entities/website.entity';
import { VersionProspectType } from 'src/constants/versions.type';

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
  secondaryActivity: SecondaryActivity;

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

  @ApiProperty({
    description: "Version du scraping; Différentes sessions de scraping sont organisées (1-> nov 2022; 2-> mai 2023)",
    required: true
  })
  version: VersionProspectType;

  @ApiProperty({
    description: "Date du scraping du prospect",
    required: true
  })
  dateScraped: Date;
}