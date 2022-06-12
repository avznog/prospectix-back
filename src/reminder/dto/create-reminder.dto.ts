import { ProjectManager } from "src/project-manager/entities/project-manager.entity";

export class CreateReminderDto {
  type: string;
  description: string;
  date?: Date;
  priority: number;
  pm: ProjectManager;
}
