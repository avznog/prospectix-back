import { ProjectManager } from "../../../users/project-managers/entities/project-manager.entity";
import { Prospect } from "../../../prospect-global/prospects/entities/prospect.entity";

export class CreateNegativeAnswerDto {
  date: Date;
  prospect: Prospect;
  pm: ProjectManager;
}
