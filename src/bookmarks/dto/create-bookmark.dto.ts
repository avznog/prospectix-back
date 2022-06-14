import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreateBookmarkDto {
  @ApiProperty({
    description: "Product manager du bookmark",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Prospect du bookmark",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Date de création du bookmark",
    required: true
  })
  creationDate: Date;
}
