import { EmailDto } from './email.dto';

export class CDPDto {
  id: number;
  firstname: string;
  lastname: string;
  email: EmailDto;
  pseudo: string;
  tokenEmail: string;
}
