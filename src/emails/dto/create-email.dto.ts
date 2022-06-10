import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreateEmailDto {
  id: number;
  prospect: CreateProspectDto;
  email: string;
}
