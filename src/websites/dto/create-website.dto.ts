import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateWebsiteDto {
  id: number;
  prospect: Prospect;
  website: string;
}
