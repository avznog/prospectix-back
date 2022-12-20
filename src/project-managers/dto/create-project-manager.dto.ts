import { ApiProperty } from '@nestjs/swagger';
import { Email } from 'src/emails/entities/email.entity';
import { Goal } from 'src/goals/entities/goal.entity';

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
    description: "Téléphone du chef de projet",
    required: false
  })
  phone: string;

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

  @ApiProperty({
    description: "Boolean indiquant si le chef de projet / compte est désactivé (supprimé pour les utilisateurs)",
    required: true
  })
  disabled: boolean;

  @ApiProperty({
    description: "Email du chef de projet",
    required: true
  })
  mail: string;

  @ApiProperty({
    description: "Apparaît ou non dans les staitstiques publiques",
    required: true
  })
  statsEnabled: boolean;

  @ApiProperty({
    description: "Objectifs du chef de projet"
  })
  goals: Goal[]

  @ApiProperty({
    description: "apparaît dans les objectifs"
  })
  objectived: boolean;
}
