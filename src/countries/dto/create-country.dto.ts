import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryDto {
  @ApiProperty({
    description: "Nom du pays",
    required: true
  })
  name: string;
}
