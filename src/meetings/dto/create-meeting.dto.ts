import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateMeetingDto {
  id: number;
  pm: ProjectManager;
  prospect: Prospect;
  type: MeetingType;
  date: Date;
}
