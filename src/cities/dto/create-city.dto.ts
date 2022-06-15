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
}
