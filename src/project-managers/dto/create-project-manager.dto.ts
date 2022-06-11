import { CreateEmailDto } from 'src/emails/dto/create-email.dto';

export class CreateProjectManagerDto {
  id: number;
  firstname: string;
  lastname: string;
  email: CreateEmailDto;
  pseudo: string;
  tokenEmail: string;
}
