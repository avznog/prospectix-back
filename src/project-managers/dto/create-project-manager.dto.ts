import { Email } from 'src/emails/entities/email.entity';

export class CreateProjectManagerDto {
  id: number;
  firstname: string;
  lastname: string;
  email: Email;
  pseudo: string;
  tokenEmail: string;
  admin: boolean;
}
