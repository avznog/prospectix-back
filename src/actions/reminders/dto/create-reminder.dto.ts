import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

export class CreateReminderDto {
  @ApiProperty({
    description: "Description du rappel",
    required: true
  })
  description: string;

  @ApiProperty({
    description: "Date du rappel",
    required: true
  })
  date: Date;

  @ApiProperty({
    description: "Priorité du rappel",
    required: true
  })
  priority: number;

  @ApiProperty({
    description: "Project manager à qui est affecté le rappel",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Prospect à qui est affecté le rappel",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Propriété indiquant si le rappel est fait ou non",
    required: true
  })
  done: boolean;

  @ApiProperty({
    description: "Date de création du rappel",
    required: true
  })
  creationDate: Date;
}
