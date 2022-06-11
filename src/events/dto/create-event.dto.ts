import { EventType } from 'src/constants/event.type';
import { CreateProjectManagerDto } from 'src/project-managers/dto/create-project-manager.dto';
import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreateEventDto {
  id: number;
  projectManager: CreateProjectManagerDto;
  prospect: CreateProspectDto;
  event: EventType;
  creationDate: Date;
}
