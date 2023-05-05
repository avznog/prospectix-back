import { ApiProperty } from '@nestjs/swagger';
import { MeetingType } from 'src/constants/meeting.type';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

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

  @ApiProperty({
    description: "Indique si le rendez-vous a été faits",
    required: true
  })
  done: boolean;

  @ApiProperty({
    description: "Date de création du rappel",
    required: true
  })
  creationDate: Date;
}
