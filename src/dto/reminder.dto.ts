import { CDPDto } from './cdp.dto';
import { ProspectDto } from './prospect.dto';

export class ReminderDto {
  id: number;
  cdp: CDPDto;
  prospect: ProspectDto;
  description: string;
  priority: number;
  date: Date;
}
