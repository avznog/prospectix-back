import { MeetingType } from "src/constants/meeting.type";
import { ProjectManager } from "src/project-managers/entities/project-manager.entity";
import { Prospect } from "src/prospects/entities/prospect.entity";

export class CreateMeetingDto {
  date: Date;
  type: string;
  prospect: Prospect;
  pm: ProjectManager;
}
