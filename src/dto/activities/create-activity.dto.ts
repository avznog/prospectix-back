import { ApiProperty } from "@nestjs/swagger";

export class CreateActivityDto {
  @ApiProperty({
    description: "Nom de l'activité",
    required: true
  })
  name: string;

  @ApiProperty({
    description: "Poids de la catégorie. Plus le poids est haut, plus la catégorie a de la valeur",
    required: true
  })
  weight: number;
}
