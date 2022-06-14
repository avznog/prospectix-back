import { Email } from 'src/emails/entities/email.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

export class CreateSentEmailDto {
  id: number;
  pm: ProjectManager;
  email: Email;
  object: string;
  message: string;
  sendingDate: Date;
}
