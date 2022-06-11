import { CreateProjectManagerDto } from 'src/project-managers/dto/create-project-manager.dto';

export class CreateGoalDto {
  id: number;
  cdp: CreateProjectManagerDto;
  isCyclic: boolean;
  deadline: Date;
  title: string;
  achievementTotalSteps: number;
}
