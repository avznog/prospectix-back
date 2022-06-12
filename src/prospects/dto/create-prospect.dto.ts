import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateCityDto } from 'src/cities/dto/create-city.dto';
import { CreateCountryDto } from 'src/countries/dto/create-country.dto';
import { CreateEmailDto } from 'src/emails/dto/create-email.dto';
import { CreatePhoneDto } from 'src/phones/dto/create-phone.dto';
import { CreateWebsiteDto } from 'src/websites/dto/create-website.dto';

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
  activity: CreateActivityDto;

  @ApiProperty({
    description: 'Adresse postale',
    required: true,
  })
  streetAddress: string;

  @ApiProperty({
    description: 'Ville',
    required: true,
  })
  city: CreateCityDto;

  @ApiProperty({
    description: 'Pays',
    required: true,
  })
  country: CreateCountryDto;

  @ApiProperty({
    description: 'Email',
  })
  email: CreateEmailDto[];

  @ApiProperty({
    description: 'Numéro de téléphone',
  })
  phone: CreatePhoneDto[];

  @ApiProperty({
    description: "Lien du site web de l'entreprise",
  })
  website: CreateWebsiteDto[];

  @ApiProperty({
    description: 'Commentaire de prospection',
  })
  comment: string;

  @ApiProperty({
    description: 'Number No, Nombre de "NON" suite à la prospection',
  })
  nbNo: number;
}
