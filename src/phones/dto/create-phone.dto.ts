import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreatePhoneDto {
  id: number;
  prospect: CreateProspectDto;
  number: string;
}
