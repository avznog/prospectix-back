import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';
import { CreateCityDto } from 'src/cities/dto/create-city.dto';
import { CreateCountryDto } from 'src/countries/dto/create-country.dto';
import { CreateEmailDto } from 'src/emails/dto/create-email.dto';
import { CreatePhoneDto } from 'src/phones/dto/create-phone.dto';
import { CreateWebsiteDto } from 'src/websites/dto/create-website.dto';

export class CreateProspectDto {
  id: number;
  companyName: string;
  activity: CreateActivityDto;
  streetAddress: string;
  city: CreateCityDto;
  country: CreateCountryDto;
  email: CreateEmailDto[];
  phone: CreatePhoneDto[];
  website: CreateWebsiteDto[];
  comment: string;
  nbNo: number;
}
