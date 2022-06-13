import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activities/entities/activity.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Phone } from 'src/phones/entities/phone.entity';
import { Website } from 'src/websites/entities/website.entity';

export class CreateProspectDto {
  @ApiProperty({
    description: 'ID du prospect',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "Nom de l'entreprise",
    required: true,
  })
  companyName: string;

  @ApiProperty({
    description: "Domaine d'activité de l'entreprise",
    required: true,
  })
  activity: Activity[];

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
    description: "Lien du site web de l'entreprise",
  })
  website: Website;

  @ApiProperty({
    description: 'Commentaire de prospection',
  })
  comment: string;

  @ApiProperty({
    description: 'Number No, Nombre de "NON" suite à la prospection',
  })
  nbNo: number;
}
