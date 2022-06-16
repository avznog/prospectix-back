import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

export class CreateGoalDto {
  @ApiProperty({
    description: "Project manager lié à l'objectif",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Propriété qui vérifie si l'objectif est récurrent",
    required: true
  })
  isCyclic: boolean;

  @ApiProperty({
    description: "Deadline de l'objectif",
    required: true
  })
  deadline: Date;

  @ApiProperty({
    description: "Titre de l'objectif",
    required: true
  })
  title: string;

  @ApiProperty({
    description: "Nombre total d'étapes pour réaliser l'objectif"
  })
  totalSteps: number;

  @ApiProperty({
    description: "Etape actuelle",
    required: true
  })
  currentStep: number;

}
