import { GoalTemplate } from "src/entities/goal-templates/goal-template.entity";
import { ProjectManager } from "src/entities/project-managers/project-manager.entity";

export class CreateGoalDto {
  goalTemplate: GoalTemplate;
  disabled: boolean;
  value: number;
  pm: ProjectManager;
}
