import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateBookmarkDto {
  id: number;
  pm: ProjectManager;
  prospect: Prospect;
  creationDate: Date;
}
