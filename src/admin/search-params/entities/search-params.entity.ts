import { ApiProperty } from "@nestjs/swagger";
import { VersionCityType, VersionPrimaryActivityType, VersionProspectType, VersionSecondaryActivityType } from "src/constants/versions.type";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SearchParams {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({enum: VersionProspectType, default: VersionProspectType.V1})
  @ApiProperty({
    description: "Types de versions possibles pour les prospects",
    required: true
  })
  versionProspect: VersionProspectType;

  @Column({enum: VersionCityType, default: VersionCityType.V1})
  @ApiProperty({
    description: "Types de versions possibles pour les villes",
    required: true
  })
  versionCity: VersionCityType;

  @Column({enum: VersionSecondaryActivityType, default: VersionSecondaryActivityType.V1})
  @ApiProperty({
    description: "Types de versions possibles pour les activités secondaires",
    required: true
  })
  versionSecondaryActivity: VersionSecondaryActivityType;

  @Column({enum: VersionPrimaryActivityType, default: VersionPrimaryActivityType.V2})
  @ApiProperty({
    description: "Types de versions possibles pour les activités primaires",
    required: true
  })
  versionPrimaryActivity: VersionPrimaryActivityType;
}