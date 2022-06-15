import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'goal' })
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    description: "Id de l'objectif",
    required: true
  })
  id: number;

  @Column()
  @ApiProperty({
    description: "Réccurrence de l'objectif",
    required: true
  })
  isCyclic: boolean;

  @Column()
  @ApiProperty({
    description: "Date deadline de l'objectif",
    required: true
  })
  deadline: Date;

  @Column()
  @ApiProperty({
    description: "Titre de l'objectif",
    required: true
  })
  title: string;

  @Column()
  @ApiProperty({
    description: "Description de l'objectif",
    required: true
  })
  description: string;

  @Column()
  @ApiProperty({
    description: "Nombre total d'étapes de l'objectif",
    required: true
  })
  totalSteps: number;

  @Column()
  @ApiProperty({
    description: "Etape actuelle de l'objectif",
    required: true
  })
  currentStep: number;

  @ManyToOne(() => ProjectManager)
  @ApiProperty({
    description: "Chef de projet à qui appartient l'objectif",
    required: true
  })
  projectManager: ProjectManager;
}
