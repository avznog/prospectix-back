import { EventType } from 'src/constants/event.type';
import { CDPDto } from './cdp.dto';
import { ProspectDto } from './prospect.dto';

export class EventDto {
  id: number;
  cdp: CDPDto;
  prospect: ProspectDto;
  event: EventType;
  creationDate: Date;
}
