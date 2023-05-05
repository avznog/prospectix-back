import { ApiProperty } from "@nestjs/swagger";
import { VersionSecondaryActivityType } from "src/constants/versions.type";
import { PrimaryActivity } from "src/prospect-global/activities/primary-activities/entities/primary-activity.entity";

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
  version: VersionSecondaryActivityType;

  @ApiProperty({
    description: "Le nombre d'appels comptés dans le poids de la catégorie",
    required: false
  })
  weightCount: number;

  @ApiProperty({
    description: "Date d'imlémentation du domaine d'activité",
    required: false
  })
  dateScraped: Date;
}

  
