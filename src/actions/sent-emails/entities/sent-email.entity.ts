import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
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
    description: "Template de l'email envoyé",
    required: true
  })
  templateName: string;

  @Column({ nullable: true})
  @ApiProperty({
    description: "Date d'envoi de l'email envoyé",
    required: true
  })
  sendingDate: Date;

  @Column({ nullable: true})
  @ApiProperty({
    description: "Date de création du mail"
  })
  date: Date;

  @Column({ default: false})
  @ApiProperty({
    description: "Si l'email est déjà envoyé ou non"
  })
  sent: boolean;

  @ManyToOne(() => Prospect)
  @ApiProperty({
    description: "Prospect a qui est envoyé le mail",
    required: true
  })
  prospect: Prospect
}
