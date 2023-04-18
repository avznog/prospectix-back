import { ApiProperty } from "@nestjs/swagger";
import { VersionProspectType, VersionCityType, VersionSecondaryActivityType, VersionPrimaryActivityType } from "src/constants/versions.type";

export class CreateSearchParamsDto {

  @ApiProperty({
    description: "Types de versions possibles pour les prospects",
    required: true
  })
  versionProspect: VersionProspectType;

  @ApiProperty({
    description: "Types de versions possibles pour les villes",
    required: true
  })
  versionCity: VersionCityType;

  @ApiProperty({
    description: "Types de versions possibles pour les activités secondaires",
    required: true
  })
  versionSecondaryActivity: VersionSecondaryActivityType;

  @ApiProperty({
    description: "Types de versions possibles pour les activités primaires",
    required: true
  })
  versionPrimaryActivity: VersionPrimaryActivityType;
}