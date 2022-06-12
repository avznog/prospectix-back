import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';
import { CreateReminderDto } from './create-reminder.dto';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
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
