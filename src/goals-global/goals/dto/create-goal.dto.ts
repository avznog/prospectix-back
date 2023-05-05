import { GoalTemplate } from "src/goals-global/goal-templates/entities/goal-template.entity";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";

export class CreateGoalDto {
  goalTemplate: GoalTemplate;
  disabled: boolean;
  value: number;
  pm: ProjectManager;
}
