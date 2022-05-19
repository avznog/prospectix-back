import { ActivityDto } from './activity.dto';
import { CityDto } from './city.dto';
import { CountryDto } from './country.dto';
import { EmailDto } from './email.dto';
import { PhoneDto } from './phone.dto';
import { WebsiteDto } from './website.dto';

export class ProspectDto {
  id: number;
  companyName: string;
  activity: ActivityDto;
  streetAddress: string;
  city: CityDto;
  country: CountryDto;
  email: EmailDto[];
  phone: PhoneDto[];
  website: WebsiteDto[];
  comment: string;
  nbNo: number;
}
