import { ApiProperty } from "@nestjs/swagger";

export class ProjectManagerDto {
  @ApiProperty({
    description: "Pseudo du chef de projet",
    required: true
  })
  pseudo: string;
}