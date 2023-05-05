import { ProjectManager } from "src/entities/project-managers/project-manager.entity";
import { Prospect } from "src/entities/prospects/prospect.entity";

export class CreateNegativeAnswerDto {
  date: Date;
  prospect: Prospect;
  pm: ProjectManager;
}
