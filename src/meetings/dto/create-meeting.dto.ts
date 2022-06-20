import { ApiProperty } from '@nestjs/swagger';
import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateMeetingDto {
  @ApiProperty({
    description: "Project manager lié au rendez-vous",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Prospect lié au rendez-vous",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Type du rendez-vous",
    required: true
  })
  type: MeetingType;

  @ApiProperty({
    description: "Date du rendez-vous",
    required: true
  })
  date: Date;
}