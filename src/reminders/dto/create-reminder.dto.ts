import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateReminderDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  pm: ProjectManager;

  @ApiProperty()
  prospect: Prospect;
}
