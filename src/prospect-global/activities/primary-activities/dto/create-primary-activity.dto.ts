import { ApiProperty } from "@nestjs/swagger";
import { VersionPrimaryActivityType } from "src/constants/versions.type";
import { SecondaryActivity } from "src/prospect-global/activities/secondary-activities/entities/secondary-activity.entity";

export class CreatePrimaryActivityDto {
  @ApiProperty({
    description: "Le nom de la catégorie primaire",
    required: true
  })
  name: string;

  @ApiProperty({
    description: "Le nom de la catégorie primaire",
    required: true
  })
  weight: number;
  secondaryActivities: SecondaryActivity[];

  @ApiProperty({
    description: "Le nombre d'appels comptés dans le poids de la catégorie",
    required: false
  })
  weightCount: number;

  @ApiProperty({
    description: "Version de l'activité",
    required: false
  })
  version: VersionPrimaryActivityType;

  @ApiProperty({
    description: "Date de l'implémentation de l'activité",
    required: false
  })
  dateScraped: Date;
}