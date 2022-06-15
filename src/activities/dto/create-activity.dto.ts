import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
  @ApiProperty({
    description: "Nom de l'activité",
    required: true
  })
  name: string;
}
