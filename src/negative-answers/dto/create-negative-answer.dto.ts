import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";

export class CreateNegativeAnswerDto {
  date: Date;
  prospect: Prospect;
  pm: ProjectManager;
}
