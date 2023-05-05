import { ApiProperty } from '@nestjs/swagger';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

export class CreateBookmarkDto {
  @ApiProperty({
    description: "Project manager à qui est lié le favoris",
    required: true
  })
  pm: ProjectManager;

  @ApiProperty({
    description: "Prospect qui correspondont au favoris",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Date de création du favoris",
    required: true
  })
  creationDate: Date;
}
