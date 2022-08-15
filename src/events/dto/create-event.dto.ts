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
    description: "Description de l'évènement",
    required: true,
    enum: {
      REMINDER: "REMINDER",
      MEETINGS: "MEETINGS",
      BOOKMARKS: "BOOKMARKS",
      CREATION: "CREATION",
      NEGATIVE_ANSWER: "NEGATIVE_ANSWER",
      NO_ANSWER: "NO_ANSWER"
    }
  })
  description: string;

  @ApiProperty({
    description: "Date de l'évènement",
    required: true
  })
  date: Date;

  @ApiProperty({
    description: "Type de l'évènement",
    required: true,
    enum: {
      REMINDER: "REMINDER",
      MEETINGS: "MEETINGS",
      BOOKMARKS: "BOOKMARKS",
      CREATION: "CREATION",
      NEGATIVE_ANSWER: "NEGATIVE_ANSWER",
      NO_ANSWER: "NO_ANSWER"
    }
  })
  type: EventType.CREATION
}