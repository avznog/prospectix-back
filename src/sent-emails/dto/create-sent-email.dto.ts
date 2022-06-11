import { CreateEmailDto } from 'src/emails/dto/create-email.dto';
import { CreateProjectManagerDto } from 'src/project-managers/dto/create-project-manager.dto';

export class CreateSentEmailDto {
  id: number;
  cdp: CreateProjectManagerDto;
  email: CreateEmailDto;
  object: string;
  message: string;
  sendingDate: Date;
}
