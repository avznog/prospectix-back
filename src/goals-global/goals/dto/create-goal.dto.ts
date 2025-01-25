import { GoalTemplate } from "../../../goals-global/goal-templates/entities/goal-template.entity";
import { ProjectManager } from "../../../users/project-managers/entities/project-manager.entity";

export class CreateGoalDto {
  goalTemplate: GoalTemplate;
  disabled: boolean;
  value: number;
  pm: ProjectManager;
}
