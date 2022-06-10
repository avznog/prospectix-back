import { EventType } from 'src/constants/event.type';
import { ProspectDto } from './prospect.dto';

export class EventDto {
  id: number;
  prospect: ProspectDto;
  event: EventType;
  creationDate: Date;
}
