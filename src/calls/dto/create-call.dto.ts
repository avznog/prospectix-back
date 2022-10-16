import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";

export class CreateCallDto {
  date: Date;
  pm: ProjectManager;
  prospect: Prospect;
}
