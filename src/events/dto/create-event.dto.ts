import { ApiProperty } from '@nestjs/swagger';
import { EventType } from 'src/constants/event.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateEventDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  pm: ProjectManager;

  @ApiProperty()
  prospect: Prospect;

  @ApiProperty()
  event: EventType;

  @ApiProperty()
  creationDate: Date;
}
