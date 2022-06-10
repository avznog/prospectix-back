import { MeetingType } from 'src/constants/meeting.type';
import { CreateProjectManagerDto } from 'src/project-managers/dto/create-project-manager.dto';
import { CreateProspectDto } from 'src/prospects/dto/create-prospect.dto';

export class CreateMeetingDto {
  id: number;
  projectManager: CreateProjectManagerDto;
  prospect: CreateProspectDto;
  type: MeetingType;
  date: Date;
}
