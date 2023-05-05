import { ApiProperty } from "@nestjs/swagger";
import { ProjectManager } from "src/users/project-managers/entities/project-manager.entity";

export class CreateMailTemplateDto {

  @ApiProperty({
    required: true,
    description: "Nom du mail template"
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "Contenu du mail tempalte",
    default: ""
  })
  content: string;

  @ApiProperty({
    required: true,
    description: "Le chef de projet à qui appartiennent les mails template"
  })
  pm: ProjectManager
}

