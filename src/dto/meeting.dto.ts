import { MeetingType } from 'src/constants/meeting.type';
import { ProspectDto } from './prospect.dto';

export class MeetingDto {
  id: number;
  
  prospect: ProspectDto;
  type: MeetingType;
  date: Date;
}
