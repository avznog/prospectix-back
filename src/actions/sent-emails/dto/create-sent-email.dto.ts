import { ApiProperty } from '@nestjs/swagger';
import { Email } from 'src/prospect-global/emails/entities/email.entity';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

export class CreateSentEmailDto {
  @ApiProperty({
    description: "Chef de projet lié à l'email envoyé",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Email",
    required: true
  })
  email: Email;

  @ApiProperty({
    description: "L'object de l'email",
    required: true
  })
  object: string;

  @ApiProperty({
    description: "Nom du template du mail",
    required: true
  })
  templateName: string;

  @ApiProperty({
    description: "Date d'envoi de l'email",
    required: true
  })
  sendingDate?: Date;

  @ApiProperty({
    description: "Date de création du mail"
  })
  date: Date;

  @ApiProperty({
    description: "Si l'email est déjà envoyé ou non"
  })
  sent: boolean;

  @ApiProperty({
    description: "Le prospect lié au mail ajouté"
  })
  prospect: Prospect
}
