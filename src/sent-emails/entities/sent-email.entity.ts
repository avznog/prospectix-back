import { ApiProperty } from '@nestjs/swagger';
import { Email } from 'src/emails/entities/email.entity';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
  pm: ProjectManager;

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

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect a qui est envoyé le mail",
    required: true
  })
  prospect: Prospect
}
