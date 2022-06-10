import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreateWebsiteDto {
  id: number;
  prospect: CreateProspectDto;
  website: string;
}
