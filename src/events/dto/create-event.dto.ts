import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateEventDto {
  @ApiProperty({
    description: "Project manager lié à l'évènement",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Prospect lié à l'évènement",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Evènement",
    required: true,
    enum: {
      NOANSWER: "NOANSWER",
      MEETING: "MEETING",
      RECALL: "RECALL",
      REJECTION: "REJECTION",
      NA: "NA"
    }
  })
  event: EventType;

  @ApiProperty({
    description: "Date de création de l'évènement",
    required: true
  })
  creationDate: Date;
}
