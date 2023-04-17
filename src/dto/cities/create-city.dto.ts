import { ApiProperty } from "@nestjs/swagger";

export class CreateCityDto {
  @ApiProperty({
    description: "Nom de la ville",
    required: true
  })
  name: string;

  @ApiProperty({
    description: "Code postal de la ville",
    required: true
  })
  zipcode: number;

  @ApiProperty({
    description: "Version d'implémentation de la ville",
    required: false
  })
  version: string;

  @ApiProperty({
    description: "Date d'implémentation de la ville dans l'application",
    required: false
  })
  dateScraped: Date;
}
