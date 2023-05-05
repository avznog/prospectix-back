import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospect-global/prospects/entities/prospect.entity";

export class CreateNegativeAnswerDto {
  date: Date;
  prospect: Prospect;
  pm: ProjectManager;
}
