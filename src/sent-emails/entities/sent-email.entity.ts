import { ApiProperty } from '@nestjs/swagger';
import { Email } from 'src/emails/entities/email.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sent_email' })
export class SentEmail extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de l'email envoyé",
    required: true
  })
  id: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet lié à l'email envoyé",
    required: true
  })
  projectManager: ProjectManager;

  @ManyToOne(() => Email)
  @ApiProperty({
    description: "Contenu de l'email envoyé",
    required: true
  })
  email: Email;

  @Column()
  @ApiProperty({
    description: "Object de l'email envoyé",
    required: true
  })
  object: string;

  @Column()
  @ApiProperty({
    description: "Message de l'email envoyé",
    required: true
  })
  message: string;

  @Column()
  @ApiProperty({
    description: "Date d'envoi de l'email envoyé",
    required: true
  })
  sendingDate: Date;
}
