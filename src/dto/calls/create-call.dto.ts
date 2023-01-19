import { ProjectManager } from "src/entities/project-managers/project-manager.entity";
import { Prospect } from "src/entities/prospects/prospect.entity";

export class CreateCallDto {
  date: Date;
  pm: ProjectManager;
  prospect: Prospect;
}
