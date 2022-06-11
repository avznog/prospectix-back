import { CreateProjectManagerDto } from 'src/project-managers/dto/create-project-manager.dto';
import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreateBookmarkDto {
  id: number;
  projectManager: CreateProjectManagerDto;
  prospect: CreateProspectDto;
  creationDate: Date;
}
