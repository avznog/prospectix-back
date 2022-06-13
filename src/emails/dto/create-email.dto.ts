import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateEmailDto {
  id: number;
  prospect: Prospect;
  email: string;
}
