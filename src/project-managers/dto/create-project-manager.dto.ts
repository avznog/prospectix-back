import { ApiProperty } from '@nestjs/swagger';
import { Email } from 'src/emails/entities/email.entity';

export class CreateProjectManagerDto {
  @ApiProperty({
    description: "Prénom du Chef de projet",
    required: true
  })
  firstname: string;

  @ApiProperty({
    description: "Nom de famille du Chef de projet",
    required: true
  })
  lastname: string;

  @ApiProperty({
    description: "Email du Chef de projet",
    required: true
  })
  email: Email;

  @ApiProperty({
    description: "Pseudo du Chef de projet",
    required: true
  })
  pseudo: string;

  @ApiProperty({
    description: "Token de l'email du chef de projet",
    required: true
  })
  tokenEmail: string;

  @ApiProperty({
    description: "Booléan qui indique si le chef de projet a le rôle admin ou non",
    required: true
  })
  admin: boolean;
}