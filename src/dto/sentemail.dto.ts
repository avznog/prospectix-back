import { CDPDto } from './cdp.dto';
import { EmailDto } from './email.dto';

export class SentEmailDto {
  id: number;
  cdp: CDPDto;
  email: EmailDto;
  object: string;
  message: string;
  sendingDate: Date;
}
