import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";

export class CreateReminderDto {
  type: string;
  description: string;
  date: Date;
  priority: number;
  pm: ProjectManager;
  prospect: Prospect;
}
