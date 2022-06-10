import { EmailDto } from './email.dto';

export class SentEmailDto {
  id: number;
  email: EmailDto;
  object: string;
  message: string;
  sendingDate: Date;
}
