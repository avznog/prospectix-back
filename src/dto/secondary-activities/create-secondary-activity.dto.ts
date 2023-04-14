import { ApiProperty } from "@nestjs/swagger";
import { PrimaryActivity } from "src/entities/primary-activity/primary-activity.entity";

export class CreateSecondaryActivityDto {
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

  @ApiProperty({
    description: "L'activité principale reliée à cette activité secondaire",
    required: true
  })
  primaryActivity: PrimaryActivity;

  @ApiProperty({
  description: "Version du scraping, cela correspond aux différentes sessions de scraping qu'on a effectuées.\n v1 -> octobre 2022 / v2 -> mai 2023",
  required: true
  })
  version: string;
}

  
