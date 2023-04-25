import { ApiProperty } from "@nestjs/swagger";
import { VersionCityType } from "src/constants/versions.type";

export class CreateCityDto {
  @ApiProperty({
    description: "Nom de la région à laquelle appartient la ville",
    required: true
  })
  name: string;

  @ApiProperty({
    description: "Code postal de la ville",
    required: true
  })
  zipcode: number;
  
  @ApiProperty({
    description: "Ville originale, correspond au zipcode"
  })
  origin: string;

  @ApiProperty({
    description: "Version d'implémentation de la ville",
    required: false
  })
  version: VersionCityType;

  @ApiProperty({
    description: "Date d'implémentation de la ville dans l'application",
    required: false
  })
  dateScraped: Date;
}
