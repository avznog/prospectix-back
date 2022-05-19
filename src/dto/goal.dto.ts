import { CDPDto } from './cdp.dto';

export class GoalDto {
  id: number;
  cdp: CDPDto;
  isCyclic: boolean;
  deadline: Date;
  title: string;
  achievementTotalSteps: number;
  currentAchievement: number;
}
