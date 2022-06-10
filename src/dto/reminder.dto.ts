import { ProspectDto } from './prospect.dto';

export class ReminderDto {
  id: number;
  prospect: ProspectDto;
  description: string;
  priority: number;
  date: Date;
}
