import { ProspectDto } from './prospect.dto';

export class EmailDto {
  id: number;
  prospect: ProspectDto;
  email: string;
}
