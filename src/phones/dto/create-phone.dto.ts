import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreatePhoneDto {
  id: number;
  prospect: Prospect;
  number: string;
}
