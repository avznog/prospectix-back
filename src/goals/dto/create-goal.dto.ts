import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';

export class CreateGoalDto {
  id: number;
  pm: ProjectManager;
  isCyclic: boolean;
  deadline: Date;
  title: string;
  achievementTotalSteps: number;
}
