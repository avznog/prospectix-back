import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

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
      ADD_REMINDER: "ADD_REMINDER",
      DONE_REMINDER: "DONE_REMINDER",
      DELETE_REMINDER: "DELETE_REMINDER",
      ADD_MEETING: "ADD_MEETING",
      DONE_MEETING: "DONE_MEETING",
      DELETE_MEETING: "DELETE_MEETING",
      ADD_SENT_EMAIL: "ADD_SENT_EMAIL",
      DELETE_SENT_EMAIL: "DELETE_SENT_EMAIL",
      ADD_BOOKMARKS: "ADD_BOOKMARKS",
      DELETE_BOOKMARKS: "DELETE_BOOKMARKS",
      CREATION: "CREATION",
      NEGATIVE_ANSWER: "NEGATIVE_ANSWER",
      NO_ANSWER: "NO_ANSWER",
      PASSAGE_PRO: "PASSAGE_PRO",
      MARK_MAIL_SENT: "MARK_MAIL_SENT",
      UPDATE_PROSPECT: "UPDATE_PROSPECT"
    }
  })
  type: EventType
}