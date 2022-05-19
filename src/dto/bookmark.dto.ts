import { CDPDto } from './cdp.dto';
import { ProspectDto } from './prospect.dto';

export class BookmarkDto {
  id: number;
  cdp: CDPDto;
  prospect: ProspectDto;
  creationDate: Date;
}
