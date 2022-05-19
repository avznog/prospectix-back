import { MeetingType } from 'src/constants/meeting.type';
import { CDPDto } from './cdp.dto';
import { ProspectDto } from './prospect.dto';

export class MeetingDto {
  id: number;
  cdp: CDPDto;
  prospect: ProspectDto;
  type: MeetingType;
  date: Date;
}
