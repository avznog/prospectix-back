import { GoalTemplate } from "src/goal-templates/entities/goal-template.entity";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";

export class CreateGoalDto {
  goalTemplate: GoalTemplate;
  disabled: boolean;
  value: number;
  pm: ProjectManager;
}
